/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { Linter } from 'eslint';
import { APEX_IMPORT_RULE_ID } from '../rules/apex/apex-import.js';
import { NO_MUTATION_SUPPORTED_RULE_ID } from '../rules/graphql/no-mutation-supported';
import { NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID } from '../rules/graphql/no-aggregate-query-supported';
import { UNSUPPORTED_SCOPE_RULE_ID } from '../rules/graphql/unsupported-scope.js';
import { NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID } from '../rules/graphql/no-fiscal-date-filtering-supported.js';
import { NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID } from '../rules/graphql/no-semi-anti-join-supported';
import { NO_MORE_THAN_1_PARENT_RECORD_RULE_ID } from '../rules/graphql/no-more-than-1-parent-record.js';
import { NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID } from '../rules/graphql/no-more-than-3-child-entities.js';
import { NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID } from '../rules/graphql/no-more-than-3-root-entities.js';
import { NO_MORE_THAN_100_FIELDS_RULE_ID } from '../rules/graphql/no-more-than-100-fields.js';
import { createScopedModuleRuleName } from '../util/rule-helpers.js';

export = {
    extends: ['./configs/base-legacy'],
    rules: {
        [createScopedModuleRuleName(APEX_IMPORT_RULE_ID)]: 'warn'
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
                [createScopedModuleRuleName(NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_MUTATION_SUPPORTED_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_MORE_THAN_1_PARENT_RECORD_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(NO_MORE_THAN_100_FIELDS_RULE_ID)]: 'warn',
                [createScopedModuleRuleName(UNSUPPORTED_SCOPE_RULE_ID)]: 'warn'
            }
        }
    ]
} satisfies Linter.BaseConfig;
