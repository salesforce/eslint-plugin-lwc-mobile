/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { Kind } from 'graphql';
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import getDocUrl from '../../util/getDocUrl';

export const NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID = 'offline-graphql-no-aggregate-query-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description: 'Aggregate operation in a query is not supported for mobile offline.',
            url: getDocUrl(NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID),
            examples: [
                {
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        query AvgOpportunityExample {
                            uiapi {
                                aggregate {
                                    Opportunity {
                                        edges {
                                            node {
                                                aggregate {
                                                    Amount {
                                                        avg {
                                                            value
                                                            displayValue
                                                        }
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
            ]
        },
        messages: {
            [NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID]:
                'Offline GraphQL: Aggregate operation in a query is not supported for mobile offline'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            Field(node) {
                // report lint issue if the graphql is like '... uiapi { aggregate { ...'
                if (
                    node.name.value === 'aggregate' &&
                    node.parent?.parent?.type === Kind.FIELD &&
                    node.parent.parent.name.value === 'uiapi'
                ) {
                    context.report({
                        node: node.name,
                        messageId: NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID
                    });
                }
            }
        };
    }
};
