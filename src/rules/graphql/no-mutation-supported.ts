import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

import { getLocation } from '../utils';
export const NO_MUTATION_SUPPORTED_RULE_ID = 'no-mutation-supported';

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
            [NO_MUTATION_SUPPORTED_RULE_ID]: 'Mutation is not supported offline'
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
