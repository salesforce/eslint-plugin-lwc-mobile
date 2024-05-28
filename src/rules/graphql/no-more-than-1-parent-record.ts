import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import getDocUrl from '../../util/getDocUrl';
import { DocumentStat, ViolationType } from './EntityStats';

export const NO_MORE_THAN_1_PARENT_RECORD_RULE_ID = 'offline-graphql-no-more-than-1-parent-record';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description: `When query fetching children entity, suggest to set query 'first' argument value.`,
            url: getDocUrl(NO_MORE_THAN_1_PARENT_RECORD_RULE_ID),
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
            [NO_MORE_THAN_1_PARENT_RECORD_RULE_ID]: `Offline GraphQL: Query fetching children relation is suggested to only fetch 1 parent record. Currently it's "{{pageSize}}".`
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
