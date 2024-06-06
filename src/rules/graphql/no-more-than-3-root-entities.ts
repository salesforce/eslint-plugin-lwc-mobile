/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { getDocUrl } from '../../util/rule-helpers';
import { DocumentStat, ViolationType } from '../../util/entity-stats';

export const NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID = 'offline-graphql-no-more-3-root-entities';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description: `Do not fetch more than 3 root entities.`,
            url: getDocUrl(NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID),
            examples: [
                {
                    title: 'Correct',
                    code: /* GraphQL */ `
                        uiapi {
                            query {
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
                    `
                },
                {
                    title: 'Correct',
                    code: /* GraphQL */ `
                        query FirstQuery {
                            uiapi {
                                query {
                                    Contact(first: 1) {
                                        edges {
                                            node {
                                                Id
                                            }
                                        }
                                    }
                                    ServiceAppointment(first: 1) {
                                        edges {
                                            node {
                                                Id
                                            }
                                        }
                                    }
                                    Case(first: 1) {
                                        edges {
                                            node {
                                                Id
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        query SecondQuery {
                            uiapi {
                                query {
                                    Contact(first: 1) {
                                        edges {
                                            node {
                                                Id
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
                        uiapi {
                            query{
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
                    `
                }
            ]
        },
        messages: {
            [NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID]: `Offline GraphQL: fetch no more than 3 root entities.`
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        const documentStat = new DocumentStat((violation) => {
            if (violation.type === ViolationType.MAX_ROOT_ENTITY_COUNT) {
                context.report({
                    node: violation.violator.node.name,
                    messageId: NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID
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
