/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

export const NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID = 'offline-graphql-no-semi-anti-join-supported';
export const NO_SEMI_JOIN_SUPPORTED_MESSAGE_ID = 'offline-graphql-no-semi-join-supported' ;
export const NO_ANTI_JOIN_SUPPORTED_MESSAGE_ID = 'offline-graphql-no-anti-join-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        hasSuggestions: false,
        docs: {
            description: 'Semi and Anti join are not supported offline',
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
            [NO_SEMI_JOIN_SUPPORTED_MESSAGE_ID]:'Offline GraphQL: Semi join is not supported offline.',
            [NO_ANTI_JOIN_SUPPORTED_MESSAGE_ID]:'Offline GraphQL: Anti join is not supported offline.'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            ObjectField(node) {
                if (node.name.value === 'inq') {
                    context.report({
                        node: node.name,
                        messageId: NO_SEMI_JOIN_SUPPORTED_MESSAGE_ID
                    });
                } else if (node.name.value === 'ninq') {
                    context.report({
                        node: node.name,
                        messageId: NO_ANTI_JOIN_SUPPORTED_MESSAGE_ID
                    });
                }
            }
        };
    }
};
