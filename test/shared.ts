/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { RuleTester } from '@typescript-eslint/rule-tester';

const RULE_TESTER_CONFIG = {
    parser: '@graphql-eslint/eslint-plugin',
    parserOptions: {
        graphQLConfig: {}
    }
};

export const ruleTester = new RuleTester(RULE_TESTER_CONFIG);
