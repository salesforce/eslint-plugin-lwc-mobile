/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { describe } from 'node:test';

import { expect } from '@jest/globals';
import { FieldNode } from 'graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLESTreeNode } from '@graphql-eslint/eslint-plugin/estree-converter/types';
import { mock } from 'jest-mock-extended';

import {
    DocumentStat,
    EntityStat,
    ViolationType,
    DEFAULT_PAGE_SIZE
} from '../../../src/util/entity-stats';

describe('DocumentStat', () => {
    it('raise root entity count violation', () => {
        const violationListener = jest.fn();
        const documentStat = new DocumentStat(violationListener);
        const operationId = 0;

        documentStat.addEntityStat(
            new EntityStat('Account', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId
        );

        documentStat.addEntityStat(
            new EntityStat('Contact', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId
        );

        documentStat.addEntityStat(
            new EntityStat('WorkOrder', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId
        );

        expect(violationListener).toHaveBeenCalledTimes(0);

        // push adding 4 entity in under an operation will raise a violation of @enum ViolationType.MAX_ROOT_ENTITY_COUNT.
        const timeSheet = new EntityStat('TimeSheet', 1, mock<GraphQLESTreeNode<FieldNode>>());
        documentStat.addEntityStat(timeSheet, operationId);
        expect(violationListener).toHaveBeenCalledTimes(1);

        const violationRaised = violationListener.mock.calls[0][0];
        expect(violationRaised.type).toBe(ViolationType.MAX_ROOT_ENTITY_COUNT);
        expect(violationRaised.operationId).toBe(operationId);
        expect(violationRaised.violator).toBe(timeSheet);
    });

    it('raise child entity count violation', () => {
        const violationListener = jest.fn();
        const documentStat = new DocumentStat(violationListener);
        const operationId = 0;

        documentStat.addEntityStat(
            new EntityStat('Account', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId
        );

        documentStat.addEntityStat(
            new EntityStat('Assets', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId,
            'Account'
        );

        documentStat.addEntityStat(
            new EntityStat('Cases', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId,
            'Account'
        );

        documentStat.addEntityStat(
            new EntityStat('Contacts', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId,
            'Account'
        );
        expect(violationListener).toHaveBeenCalledTimes(0);

        /** adding 4th child Contracts for parent Account will raise a violation of @enum ViolationType.MAX_PARENT_RECORD_COUNT. */
        const contracts = new EntityStat('Contracts', 1, mock<GraphQLESTreeNode<FieldNode>>());
        documentStat.addEntityStat(contracts, operationId, 'Account');
        expect(violationListener).toHaveBeenCalledTimes(1);

        const violationRaised = violationListener.mock.calls[0][0];
        expect(violationRaised.type).toBe(ViolationType.MAX_CHILD_ENTITY_COUNT);
        expect(violationRaised.operationId).toBe(operationId);
        expect(violationRaised.violator).toBe(contracts);
    });

    it('max parent record count violation is not raised if parent record count is 1', () => {
        const violationListener = jest.fn();
        const documentStat = new DocumentStat(violationListener);
        const operationId = 0;

        documentStat.addEntityStat(
            new EntityStat('Account', 1, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId
        );

        documentStat.addEntityStat(
            new EntityStat('Assets', 100, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId,
            'Account'
        );
        expect(violationListener).toHaveBeenCalledTimes(0);
    });

    it('max parent record count violation is raised if parent record count is not 1', () => {
        const violationListener = jest.fn();
        const documentStat = new DocumentStat(violationListener);
        const operationId = 0;

        const account = new EntityStat(
            'Account',
            DEFAULT_PAGE_SIZE,
            mock<GraphQLESTreeNode<FieldNode>>()
        );
        documentStat.addEntityStat(account, operationId);

        documentStat.addEntityStat(
            new EntityStat('Assets', 100, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId,
            'Account'
        );

        expect(violationListener).toHaveBeenCalledTimes(1);

        const violationRaised1 = violationListener.mock.calls[0][0];
        expect(violationRaised1.type).toBe(ViolationType.MAX_PARENT_RECORD_COUNT);
        expect(violationRaised1.operationId).toBe(operationId);
        expect(violationRaised1.violator).toBe(account);

        documentStat.addEntityStat(
            new EntityStat('Cases', 100, mock<GraphQLESTreeNode<FieldNode>>()),
            operationId,
            'Account'
        );

        expect(violationListener).toHaveBeenCalledTimes(2);

        const violationRaised = violationListener.mock.calls[1][0];
        expect(violationRaised.type).toBe(ViolationType.MAX_PARENT_RECORD_COUNT);
        expect(violationRaised.operationId).toBe(operationId);
        expect(violationRaised.violator).toBe(account);
    });
});
