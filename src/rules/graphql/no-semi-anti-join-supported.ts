/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

export const NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID = 'offline-graphql-no-semi-anti-join-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        hasSuggestions: false,
        docs: {
            description: 'Semi-join and anti-join filters are not supported for mobile offline. See Feature Limitations of Offline GraphQL (https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.',
            category: 'Operations',
            recommended: true,
            examples: [
                {
                    title: 'Correct',
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
                },
                {
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        query AccountExample {
                            uiapi {
                                query {
                                    Account (where: {
                                        Id: { inq: {
                                          Opportunity: {
                                            StageName: { eq: "Closed Won" } },
                                            ApiName:"AccountId"
                                            }
                                          }
                                      }) {
                                          edges {
                                            node {
                                              Id
                                              Name { value }
                                            }
                                          }
                                      }
                                   }
                                }
                            }
                        }
                    `
                },
                {
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        query AccountExample {
                            uiapi {
                                query {
                                    Account (where: {
                                        Id: { ninq: {
                                          Opportunity: {
                                            StageName: { eq: "Closed Won" } },
                                            ApiName:"AccountId"
                                            }
                                          }
                                      }) {
                                          edges {
                                            node {
                                              Id
                                              Name { value }
                                            }
                                          }
                                      }
                                   }
                                }
                            }
                        }
                    `
                }
            ]
        },
        messages: {
            [NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID]:
                'Offline GraphQL: {{joinType}}-join filters are not supported for mobile offline.'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            ObjectField(node) {
                if (node.name.value === 'inq') {
                    context.report({
                        node: node.name,
                        messageId: NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID,
                        data: {
                            joinType: 'Semi'
                        }
                    });
                } else if (node.name.value === 'ninq') {
                    context.report({
                        node: node.name,
                        messageId: NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID,
                        data: {
                            joinType: 'Anti'
                        }
                    });
                }
            }
        };
    }
};
