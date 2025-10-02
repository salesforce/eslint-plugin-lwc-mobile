/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { ESLintUtils } from '@typescript-eslint/utils';
import { version, homepage } from '../../package.json';

export function getDocUrl(ruleName: string): string {
    return `${homepage}/blob/v${version}/src/docs/${ruleName}.md`;
}

export const createRule = ESLintUtils.RuleCreator((name) => getDocUrl(name));

export function createScopedModuleRuleName(ruleName: string): string {
    return `@salesforce/lwc-mobile/${ruleName}`;
}
