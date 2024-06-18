/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { DocumentStat, ViolationType } from '../../util/entity-stats';

export const NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID = 'offline-graphql-no-more-3-child-entities';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description: `Offline GraphQL: Do not fetch more than 3 child entities.`,
            examples: [
                {
                    title: 'Correct',
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
                                            Opportunities {
                                                edges {
                                                    node {
                                                        Id
                                                    }
                                                }
                                            }
                                            Cases {
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
                },
                {
                    title: 'Incorrect',
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
                                            Opportunities {
                                                edges {
                                                    node {
                                                        Id
                                                    }
                                                }
                                            }
                                            Cases {
                                                edges {
                                                    node {
                                                        Id
                                                    }
                                                }
                                            }
                                            Documents {
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
            ]
        },
        messages: {
            [NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID]: `Offline GraphQL: fetch no more than 3 child entities.`
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        const documentStat = new DocumentStat((violation) => {
            if (violation.type === ViolationType.MAX_CHILD_ENTITY_COUNT) {
                context.report({
                    node: violation.violator.node.name,
                    messageId: NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID
                });
            }
        });

        return {
            Field(node) {
                if (node.name.value === 'edges') {
                    documentStat.findEntityAndBuildUpStat(node);
                }
            }
        };
    }
};
