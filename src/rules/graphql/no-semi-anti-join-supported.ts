/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

import { getLocation } from '../../utils';
export const NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID = 'offline-graphql-no-semi-anti-join-supported';
;export const NO_SEMI_JOIN_SUPPORTED_MESSAGE_ID = 'offline-graphql-no-semi-join-supported' ;
export const NO_ANTI_JOIN_SUPPORTED_MESSAGE_ID = 'offline-graphql-no-anti-join-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        hasSuggestions: false,
        docs: {
            description: 'mutation is not supported offline',
            category: 'Operations',
            recommended: true,
            examples: [
                {
                    title: 'Correct',
                    code: /* GraphQL */ `
                        query accountQuery {
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
            []:
                'Offline GraphQL: Mutation (data modification) is not supported offline.'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            OperationDefinition(node) {
                if (node.operation === 'mutation') {
                    context.report({
                        messageId: NO_MUTATION_SUPPORTED_RULE_ID,
                        loc: getLocation(node.loc.start, node.operation)
                    });
                }
            }
        };
    }
};
