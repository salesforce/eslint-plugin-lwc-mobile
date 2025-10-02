/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { getDocUrl } from '../../src/util/rule-helpers';

describe('getDocUrl', () => {
    it('doc url returned should be right value', () => {
        const docUrl = getDocUrl('ruleNameXYZ');
        expect(
            docUrl.startsWith('https://github.com/salesforce/eslint-plugin-lwc-mobile/blob/v')
        ).toBe(true);
        expect(docUrl.endsWith('/src/docs/ruleNameXYZ.md')).toBe(true);
    });
});
