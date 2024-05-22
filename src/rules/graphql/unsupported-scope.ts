import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { Kind } from 'graphql';

export const UNSUPPORTED_SCOPE_RULE_ID = 'offline-graphql-unsupported-scope';

export const SCOPE_SUPPORTED_FOR_CERTAIN_ENTITIES_ONLY = 'ASSIGNED_TO_ME__SERVICEAPPOINTMENT_ONLY';
export const OTHER_UNSUPPORTED_SCOPE = 'OTHER_UNSUPPORTED_SCOPE';

// key is scope name, value is the array of supported entities. Empty array means that all entities are supported.
const supportedScopes: Record<string, string[]> = {
    MINE: [],
    ASSIGNEDTOME: ['ServiceAppointment']
};
export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        docs: {
            description: `For mobile offline use cases, scope "MINE" is supported and scope "ASSIGNEDTOME" is only supported for ServiceAppointment . All other scopes like TEAM, QUEUE_OWNED and USER_OWNED are not supported `,
            category: 'Operations',
            recommended: true,
            examples: [
                {
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        query scopeQuery {
                            uiapi {
                                query {
                                    Case(scope: EVERYTHING) {
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
                        query assignedtomeQuery {
                            uiapi {
                                query {
                                    Case(scope: ASSIGNEDTOME) {
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
                }
            ]
        },
        messages: {
            [SCOPE_SUPPORTED_FOR_CERTAIN_ENTITIES_ONLY]:
                'Offline GraphQL: Scope "{{scopeName}}" is only supported for the "{{supportedEntities}}" entity, for mobile offline use cases',
            [OTHER_UNSUPPORTED_SCOPE]:
                'Offline GraphQL: Scope "{{scopeName}}" is unsupported for mobile offline use cases.'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            Argument(node) {
                if (node.name.value === 'scope') {
                    if (node.value.kind === Kind.ENUM) {
                        const scopeName = node.value.value;
                        if (supportedScopes[scopeName] === undefined) {
                            context.report({
                                messageId: OTHER_UNSUPPORTED_SCOPE,
                                data: {
                                    scopeName
                                },
                                loc: {
                                    start: node.loc.start,
                                    end: node.value.loc.end
                                }
                            });
                        } else {
                            const entities = supportedScopes[scopeName];
                            if (entities.length > 0) {
                                const entityNode = node.parent as any;
                                if (entityNode.name.kind === Kind.NAME) {
                                    const entityName = entityNode.name.value;
                                    if (!entities.includes(entityName)) {
                                        context.report({
                                            messageId: SCOPE_SUPPORTED_FOR_CERTAIN_ENTITIES_ONLY,
                                            loc: {
                                                start: node.loc.start,
                                                end: node.value.loc.end
                                            },
                                            data: {
                                                scopeName,
                                                supportedEntities: entities.join(', ')
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
};
