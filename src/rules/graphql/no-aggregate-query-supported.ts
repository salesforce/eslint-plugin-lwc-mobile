/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { Kind } from 'graphql';
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { getDocUrl } from '../../util/rule-helpers';

const RULE_NAME = 'no-aggregate-query-supported';
export const NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID = 'offline-graphql-no-aggregate-query-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            url: getDocUrl(RULE_NAME),
            description:
                'Aggregate operations in a GraphQL query are not supported for mobile offline. See Feature Limitations of Offline GraphQL (https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.',
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
                'Offline GraphQL: Aggregate operations in a query are not supported for mobile offline.'
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
