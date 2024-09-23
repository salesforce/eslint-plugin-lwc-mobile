/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import {
    rule,
    NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID
} from '../../../src/rules/graphql/no-semi-anti-join-supported';
import { createScopedModuleRuleName } from '../../../src/util/rule-helpers';
import { GraphQLRuleTester } from '@graphql-eslint/eslint-plugin';
const ruleTester = new GraphQLRuleTester();

ruleTester.run(createScopedModuleRuleName(NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID), rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query AccountExample {
                    uiapi {
                        query {
                            Account {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
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
                query AccountExample {
                    uiapi {
                        query {
                            Account(
                                where: {
                                    Id: {
                                        inq: {
                                            Opportunity: { StageName: { eq: "Closed Won" } }
                                            ApiName: "AccountId"
                                        }
                                    }
                                }
                            ) {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
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
                    messageId: NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID,
                    data: {
                        joinType: 'Semi'
                    }
                }
            ]
        },
        {
            code: /* GraphQL */ `
                query AccountExample {
                    uiapi {
                        query {
                            Account(
                                where: {
                                    Id: {
                                        ninq: {
                                            Opportunity: { StageName: { eq: "Closed Won" } }
                                            ApiName: "AccountId"
                                        }
                                    }
                                }
                            ) {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
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
                    messageId: NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID,
                    data: {
                        joinType: 'Anti'
                    }
                }
            ]
        }
    ]
});
