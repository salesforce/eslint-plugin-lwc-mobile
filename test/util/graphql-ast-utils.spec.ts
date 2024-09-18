/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { describe } from 'node:test';
import { getLocation } from '../../src/util/graphql-ast-utils';
import { Position } from 'estree';

import { expect } from '@jest/globals';

describe('utils', () => {
    it('getLocation() should return location with field name length added', () => {
        const startLocation: Position = {
            line: 1,
            column: 1
        };

        const result = getLocation(startLocation, 'Field1');
        expect(result.end).toMatchObject({
            line: 1,
            column: 7
        });
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });
    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });
    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });
    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });

    it('sample code', async () => {
        expect(1).toBe(1);
    });
});
