/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

import { getLocation } from '../../util/graphql-ast-utils';
import { getDocUrl } from '../../util/rule-helpers';

export const NO_MUTATION_SUPPORTED_RULE_ID = 'offline-graphql-no-mutation-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            url: getDocUrl(NO_MUTATION_SUPPORTED_RULE_ID),
            description:
                'Mutation (data modification) is not supported for mobile offline. See Feature Limitations of Offline GraphQL (https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.',
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
                        mutation AccountExample {
                            uiapi {
                                AccountCreate(input: { Account: { Name: "Trailblazer Express" } }) {
                                    Record {
                                        Id
                                        Name {
                                            value
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
            [NO_MUTATION_SUPPORTED_RULE_ID]:
                'Offline GraphQL: Mutation (data modification) is not supported for mobile offline.'
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
