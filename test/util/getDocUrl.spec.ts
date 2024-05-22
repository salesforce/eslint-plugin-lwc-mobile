import { describe } from 'node:test';

import { expect } from '@jest/globals';
import getDocUrl from '../../src/util/getDocUrl';

describe('getDocUrl', () => {
    it('doc url returned should be right value', () => {
        const docUrl = getDocUrl('ruleNameXYZ');
        expect(
            docUrl.startsWith('https://github.com/salesforce/eslint-plugin-lwc-mobile/blob/v')
        ).toBe(true);
        expect(docUrl.endsWith('/lib/docs/ruleNameXYZ.md')).toBe(true);
    });
});
