/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export = {
    plugins: ['@salesforce/lwc-mobile', '@graphql-eslint'],
    overrides: [
        {
            files: ['*.js'],
            processor: '@graphql-eslint/graphql'
        },
        {
            files: ['*.graphql'],
            parser: '@graphql-eslint/eslint-plugin',

            parserOptions: {
                skipGraphQLConfig: true
            },
            rules: {
                '@graphql-eslint/no-duplicate-fields': 'error',
                '@salesforce/lwc-mobile/no-aggregate-query-supported': 'warn'
            }
        }
    ]
} satisfies ClassicConfig.Config;
