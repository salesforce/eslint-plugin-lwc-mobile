/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export = {
    extends: ['./configs/base'],
    rules: {
        '@salesforce/lwc-mobile/apex-import': 'warn'
    },
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
                '@salesforce/lwc-mobile/offline-graphql-no-mutation-supported': 'warn',
                '@salesforce/lwc-mobile/offline-graphql-no-aggregate-query-supported': 'warn',
                '@salesforce/lwc-mobile/offline-graphql-unsupported-scope': 'warn'
            }
        }
    ]
} satisfies ClassicConfig.Config;
