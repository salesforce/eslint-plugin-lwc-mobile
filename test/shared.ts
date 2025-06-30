/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { RuleTester } from 'eslint';
import { parseForESLint } from '@graphql-eslint/eslint-plugin';

export const ruleTester = new RuleTester({
    languageOptions: {
        parser: { parseForESLint },
        parserOptions: {
            graphQLConfig: {}
        }
    }
});
