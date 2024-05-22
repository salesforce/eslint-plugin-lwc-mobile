/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';
import { APEX_IMPORT_RULE_ID } from '../rules/apex/apex-import.js';
import { NO_MUTATION_SUPPORTED_RULE_ID } from '../rules/graphql/no-mutation-supported';
import { NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID } from '../rules/graphql/no-aggregate-query-supported';
import { UNSUPPORTED_SCOPE_RULE_ID } from '../rules/graphql/unsupported-scope.js';
import { NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID } from '../rules/graphql/no-semi-anti-join-supported';
import { createFullRuleName } from '../util/createFullRuleName';

export = {
    extends: ['./configs/base'],
    rules: {
        [createFullRuleName(APEX_IMPORT_RULE_ID)]: 'warn',
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
                [createFullRuleName(NO_MUTATION_SUPPORTED_RULE_ID)]: 'warn',
                [createFullRuleName(NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID)]: 'warn',
                [createFullRuleName(UNSUPPORTED_SCOPE_RULE_ID)]: 'warn',
                [createFullRuleName(NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID)]: 'warn'
            }
        }
    ]
} satisfies ClassicConfig.Config;
