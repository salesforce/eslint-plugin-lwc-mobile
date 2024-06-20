/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { DocumentStat, ViolationType } from '../../util/entity-stats';

export const NO_MORE_THAN_1_PARENT_RECORD_RULE_ID = 'offline-graphql-no-more-than-1-parent-record';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description: `Offline GraphQL: You should only query one parent entity, for queries fetching child entities. Set the parent's 'first' argument value to 1.`,
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
                    `
                },
                {
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        query {
                            uiapi {
                                Account(first: 100) {
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
            ]
        },
        messages: {
            [NO_MORE_THAN_1_PARENT_RECORD_RULE_ID]: `Offline GraphQL: Queries fetching child entities should only fetch 1 parent record. Currently it's "{{pageSize}}".`
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        const reportedViolations: Array<string> = [];

        const documentStat = new DocumentStat((violation) => {
            if (violation.type === ViolationType.MAX_PARENT_RECORD_COUNT) {
                // Deduping the violation reporting, only report once for parent record count over 1 even
                // it could have multiple children entities
                const key = `${violation.operationId}_${violation.violator.name}`;
                if (!reportedViolations.includes(key)) {
                    reportedViolations.push(key);
                    context.report({
                        node: violation.violator.node.name,
                        messageId: NO_MORE_THAN_1_PARENT_RECORD_RULE_ID,
                        data: {
                            pageSize: violation.violator.pageSize.toString()
                        }
                    });
                }
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
