/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { FieldNode } from 'graphql';
import { GraphQLESTreeNode } from './types';

import {
    getEntityNodeForEdges,
    getOperationIndex,
    getPageSizeFromEntityNode,
    getParentEntityNode,
    GraphQLESFieldNode
} from '../../util/graphqlAstUtils';

export const DEFAULT_PAGE_SIZE = 10;
const MAX_PARENT_RECORD_COUNT_WITH_PREDICATED_CHILD = 1;
const MAX_ROOT_ENTITY_COUNT_COUNT = 3;
const MAX_CHILD_ENTITY_TYPE_COUNT = 3;

type EntityName = string;
type Parent = EntityName | undefined;
type OperationId = number;

export enum ViolationType {
    MAX_PARENT_RECORD_COUNT = 'max_parent_record_count',
    MAX_ROOT_ENTITY_COUNT = 'max_root_entity_count',
    MAX_CHILD_ENTITY_COUNT = 'max_child_entity_count'
}

interface Violation {
    type: ViolationType;
    operationId: OperationId;
    violator: EntityStat;
}

export type ViolationListener = (violation: Violation) => void;

/*
 *
 */
export class EntityStat {
    name: EntityName; // entity/object name
    pageSize: number; // the value of 'first' argument from graph entity query
    node: GraphQLESTreeNode<FieldNode>; //
    childrenEntities: Array<EntityStat>; // children entity query

    constructor(name: string, pageSize: number, node: GraphQLESTreeNode<FieldNode>) {
        this.name = name;
        this.pageSize = pageSize;
        this.node = node;
        this.childrenEntities = [];
    }
}

/*
 * The graphql document entity statistics collector used for tracking entity page size and child entities.
 * As ast function is called when the graphql is parsed, statistics will be populated and
 * call the ViolationListener if triggered violation.
 */
export class DocumentStat {
    entityStats: Record<OperationId, Array<EntityStat>>;
    violationListener: ViolationListener;
    constructor(violationListener: ViolationListener) {
        this.entityStats = {};
        this.violationListener = violationListener;
    }

    /**
     * find the entity node for the specified edges, find possible parent entity node and build up the state
     * @param edgesNode
     * @param documentStat
     */
    findEntityAndBuildUpStat(edgesNode: GraphQLESFieldNode) {
        const entityNode = getEntityNodeForEdges(edgesNode);
        if (entityNode != null) {
            const pageSize = getPageSizeFromEntityNode(entityNode);
            const entityStat = new EntityStat(entityNode.name.value, pageSize, entityNode);
            const parentEntity = getParentEntityNode(entityNode);
            const operationIndex = getOperationIndex(entityNode);
            this.addEntityStat(entityStat, operationIndex, parentEntity?.name.value);
        }
    }

    addEntityStat(entityStat: EntityStat, operationId: OperationId, parent: Parent = undefined) {
        if (this.entityStats[operationId] === undefined) {
            this.entityStats[operationId] = [];
        }
        const operationEntityStats = this.entityStats[operationId];

        if (parent === undefined) {
            // add new root entity and check if trigger violation
            operationEntityStats.push(entityStat);
            if (operationEntityStats.length > MAX_ROOT_ENTITY_COUNT_COUNT) {
                this.violationListener({
                    type: ViolationType.MAX_ROOT_ENTITY_COUNT,
                    operationId,
                    violator: entityStat
                });
            }
        } else {
            const parentEntityStat = operationEntityStats
                .filter((entityStat) => {
                    return entityStat.name === parent;
                })
                .pop();
            if (parentEntityStat === undefined) {
                throw new Error(`the parent entity stat is not found for specified ${parent}`);
            }

            // raise violation if parent entity pagesize is over the max allowed
            if (parentEntityStat.pageSize > MAX_PARENT_RECORD_COUNT_WITH_PREDICATED_CHILD) {
                this.violationListener({
                    type: ViolationType.MAX_PARENT_RECORD_COUNT,
                    operationId,
                    violator: parentEntityStat
                });
            }

            parentEntityStat.childrenEntities.push(entityStat);
            // check children entity count, and call violation listener if over the max allowed.
            if (parentEntityStat.childrenEntities.length > MAX_CHILD_ENTITY_TYPE_COUNT) {
                this.violationListener({
                    type: ViolationType.MAX_CHILD_ENTITY_COUNT,
                    operationId,
                    violator: entityStat
                });
            }
        }
    }
}
