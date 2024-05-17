import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

import { getLocation } from '../utils';
export const MESSAGE_ID = 'mutation-not-supported';

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
            [MESSAGE_ID]: 'Mutation is not supported offline'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            OperationDefinition(node) {
                if (node.operation === 'mutation') {
                    context.report({
                        messageId: MESSAGE_ID,
                        loc: getLocation(node.loc.start, node.operation)
                    });
                }
            }
        };
    }
};
