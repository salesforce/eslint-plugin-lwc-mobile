/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { Kind, FieldNode } from 'graphql';
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import {
    getClosestAncestorByType,
    getEntityNodeForEdges,
    getPageSizeFromEntityNode,
    getParentEntityNode
} from '../../util/graphql-ast-utils';
import { getDocUrl } from '../../util/rule-helpers';

export const NO_MORE_THAN_100_FIELDS_RULE_ID = 'offline-graphql-no-more-than-100-fields';

const RULE_NAME = 'no-more-than-100-fields';
const MAX_SOQL_API_SERVER_ALLOWD_RECORD_NUMBER = 200;

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            url: getDocUrl(RULE_NAME),
            description:
                'For an entity with more than 100 fields, the server may not return all of the expected records',
            examples: [
                {
                    title: 'Correct',
                    code: /* GraphQL */ `
                        query accountQuery {
                            uiapi {
                                query {
                                    Account {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    `
                },
                {
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        query OpportunityExample {
                            uiapi {
                                query {
                                    Opportunity(first: 201) {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                                Field1 {
                                                    value
                                                }
                                                Field2 {
                                                    value
                                                }
                                                Field3 {
                                                    value
                                                }
                                                Field4 {
                                                    value
                                                }
                                                Field5 {
                                                    value
                                                }
                                                Field6 {
                                                    value
                                                }
                                                Field7 {
                                                    value
                                                }
                                                Field8 {
                                                    value
                                                }
                                                Field9 {
                                                    value
                                                }
                                                Field10 {
                                                    value
                                                }
                                                Field11 {
                                                    value
                                                }
                                                Field12 {
                                                    value
                                                }
                                                Field13 {
                                                    value
                                                }
                                                Field14 {
                                                    value
                                                }
                                                Field15 {
                                                    value
                                                }
                                                Field16 {
                                                    value
                                                }
                                                Field17 {
                                                    value
                                                }
                                                Field18 {
                                                    value
                                                }
                                                Field19 {
                                                    value
                                                }
                                                Field20 {
                                                    value
                                                }
                                                Field21 {
                                                    value
                                                }
                                                Field22 {
                                                    value
                                                }
                                                Field23 {
                                                    value
                                                }
                                                Field24 {
                                                    value
                                                }
                                                Field25 {
                                                    value
                                                }
                                                Field26 {
                                                    value
                                                }
                                                Field27 {
                                                    value
                                                }
                                                Field28 {
                                                    value
                                                }
                                                Field29 {
                                                    value
                                                }
                                                Field30 {
                                                    value
                                                }
                                                Field31 {
                                                    value
                                                }
                                                Field32 {
                                                    value
                                                }
                                                Field33 {
                                                    value
                                                }
                                                Field34 {
                                                    value
                                                }
                                                Field35 {
                                                    value
                                                }
                                                Field36 {
                                                    value
                                                }
                                                Field37 {
                                                    value
                                                }
                                                Field38 {
                                                    value
                                                }
                                                Field39 {
                                                    value
                                                }
                                                Field40 {
                                                    value
                                                }
                                                Field41 {
                                                    value
                                                }
                                                Field42 {
                                                    value
                                                }
                                                Field43 {
                                                    value
                                                }
                                                Field44 {
                                                    value
                                                }
                                                Field45 {
                                                    value
                                                }
                                                Field46 {
                                                    value
                                                }
                                                Field47 {
                                                    value
                                                }
                                                Field48 {
                                                    value
                                                }
                                                Field49 {
                                                    value
                                                }
                                                Field50 {
                                                    value
                                                }
                                                Field51 {
                                                    value
                                                }
                                                Field52 {
                                                    value
                                                }
                                                Field53 {
                                                    value
                                                }
                                                Field54 {
                                                    value
                                                }
                                                Field55 {
                                                    value
                                                }
                                                Field56 {
                                                    value
                                                }
                                                Field57 {
                                                    value
                                                }
                                                Field58 {
                                                    value
                                                }
                                                Field59 {
                                                    value
                                                }
                                                Field60 {
                                                    value
                                                }
                                                Field61 {
                                                    value
                                                }
                                                Field62 {
                                                    value
                                                }
                                                Field63 {
                                                    value
                                                }
                                                Field64 {
                                                    value
                                                }
                                                Field65 {
                                                    value
                                                }
                                                Field66 {
                                                    value
                                                }
                                                Field67 {
                                                    value
                                                }
                                                Field68 {
                                                    value
                                                }
                                                Field69 {
                                                    value
                                                }
                                                Field70 {
                                                    value
                                                }
                                                Field71 {
                                                    value
                                                }
                                                Field72 {
                                                    value
                                                }
                                                Field73 {
                                                    value
                                                }
                                                Field74 {
                                                    value
                                                }
                                                Field75 {
                                                    value
                                                }
                                                Field76 {
                                                    value
                                                }
                                                Field77 {
                                                    value
                                                }
                                                Field78 {
                                                    value
                                                }
                                                Field79 {
                                                    value
                                                }
                                                Field80 {
                                                    value
                                                }
                                                Field81 {
                                                    value
                                                }
                                                Field82 {
                                                    value
                                                }
                                                Field83 {
                                                    value
                                                }
                                                Field84 {
                                                    value
                                                }
                                                Field85 {
                                                    value
                                                }
                                                Field86 {
                                                    value
                                                }
                                                Field87 {
                                                    value
                                                }
                                                Field88 {
                                                    value
                                                }
                                                Field89 {
                                                    value
                                                }
                                                Field90 {
                                                    value
                                                }
                                                Field91 {
                                                    value
                                                }
                                                Field92 {
                                                    value
                                                }
                                                Field93 {
                                                    value
                                                }
                                                Field94 {
                                                    value
                                                }
                                                Field95 {
                                                    value
                                                }
                                                Field96 {
                                                    value
                                                }
                                                Field97 {
                                                    value
                                                }
                                                Field98 {
                                                    value
                                                }
                                                Field99 {
                                                    value
                                                }
                                                Field100 {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    `
                }
            ]
        },
        messages: {
            [NO_MORE_THAN_100_FIELDS_RULE_ID]:
                'Offline GraphQL: The root "{{entityName}}" entity query contains {{numberOfFields}} fields and requests {{numberOfRecords}} records. If a root entity query has more than 100 fields and requests over 200 records, the query will be capped to 200 records'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            Field(node) {
                if (node.name.value === 'node') {
                    const childSelectionSet = node.selectionSet;
                    if (
                        childSelectionSet !== undefined &&
                        childSelectionSet.selections.length > 100
                    ) {
                        const edgeNode = getClosestAncestorByType<FieldNode, FieldNode>(
                            node,
                            Kind.FIELD
                        );
                        if (edgeNode?.name.value !== 'edges') {
                            return;
                        }

                        const entityNode = getEntityNodeForEdges(edgeNode);
                        if (entityNode !== undefined) {
                            const isRootQuery = getParentEntityNode(entityNode) === undefined;
                            const pageSize = getPageSizeFromEntityNode(entityNode);

                            // Root query has m
                            if (
                                isRootQuery &&
                                pageSize > MAX_SOQL_API_SERVER_ALLOWD_RECORD_NUMBER
                            ) {
                                context.report({
                                    messageId: NO_MORE_THAN_100_FIELDS_RULE_ID,
                                    node: entityNode.name,
                                    data: {
                                        entityName: entityNode.name.value,
                                        numberOfFields:
                                            childSelectionSet.selections.length.toString(),
                                        numberOfRecords: pageSize.toString()
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };
    }
};
