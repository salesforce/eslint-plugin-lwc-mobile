import { FieldNode } from 'graphql';
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Operations',
            description:
                'Inform that aggregate operation in graphql query is not supported for mobile offline.'
            // url:
        },
        messages: {
            aggregateQueryNotSupported:
                'Aggregate operation in graphql query is not supported for mobile offline'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            Field(node) {
                // report
                if (
                    node.name.value !== 'aggregate' ||
                    node.parent?.parent === undefined ||
                    node.parent.parent.type !== 'Field'
                ) {
                    return;
                }

                const upperField = node.parent.parent as unknown as FieldNode;

                if (upperField.name.value === 'uiapi') {
                    context.report({
                        node: node.name,
                        messageId: 'aggregateQueryNotSupported'
                    });
                }
            }
        };
    }
};
