import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'messageIdForFooMustBeBar';

const ruleEnforceFoorBar: TSESLint.RuleModule<MessageIds> = {
    defaultOptions: [],
    meta: {
        type: 'problem',
        messages: {
            messageIdForFooMustBeBar: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
        },
        fixable: 'code',
        schema: []
    },
    create: (context) => ({
        VariableDeclarator: (node) => {
            // Performs action in the function on every variable declarator
            if (node.parent.type === AST_NODE_TYPES.VariableDeclaration) {
                // Check if variable name is `foo`
                if (node.id.type === AST_NODE_TYPES.Identifier && node.id.name === 'foo') {
                    // Check if value of variable is "bar"
                    if (
                        node.init?.type === AST_NODE_TYPES.Literal &&
                        node.init?.value !== 'bar'
                    ) {
                        /*
                        * Report error to ESLint. Error message uses
                        * a message placeholder to include the incorrect value
                        * in the error message.
                        * Also includes a `fix(fixer)` function that replaces
                        * any values assigned to `const foo` with "bar".
                        */
                        context.report({
                            node,
                            messageId: 'messageIdForFooMustBeBar',
                            data: {
                                notBar: node.init.value
                            },
                            fix(fixer) {
                                return fixer.replaceText(node.init!!, '"bar"');
                            }
                        });
                    }
                }
            }
        }
    })
}

export default ruleEnforceFoorBar;