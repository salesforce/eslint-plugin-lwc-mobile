/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import {
    rule,
    NO_MORE_THAN_1_PARENT_RECORD_RULE_ID
} from '../../../src/rules/graphql/no-more-than-1-parent-record';
import { createScopedModuleRuleName } from '../../../src/util/rule-helpers';

import { GraphQLRuleTester } from '@graphql-eslint/eslint-plugin';
const ruleTester = new GraphQLRuleTester();

ruleTester.run(createScopedModuleRuleName(NO_MORE_THAN_1_PARENT_RECORD_RULE_ID), rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query {
                    uiapi {
                        Account(first: 1) {
                            edges {
                                node {
                                    Id
                                    Contacts {
                                        edges {
                                            node {
                                                Id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `
        }
    ],
    invalid: [
        {
            code: /* GraphQL */ `
                query {
                    uiapi {
                        Account(first: 30) {
                            edges {
                                node {
                                    Id
                                    Contacts {
                                        edges {
                                            node {
                                                Id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_MORE_THAN_1_PARENT_RECORD_RULE_ID,
                    data: {
                        pageSize: 30
                    }
                }
            ]
        },
        {
            code: /* GraphQL */ `
                query {
                    uiapi {
                        Account {
                            edges {
                                node {
                                    Id
                                    Contacts {
                                        edges {
                                            node {
                                                Id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_MORE_THAN_1_PARENT_RECORD_RULE_ID,
                    data: {
                        pageSize: 10
                    }
                }
            ]
        }
    ]
});
