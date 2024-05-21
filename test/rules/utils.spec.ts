import { describe } from 'node:test';
import { getLocation } from '../../src/utils';
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
});
