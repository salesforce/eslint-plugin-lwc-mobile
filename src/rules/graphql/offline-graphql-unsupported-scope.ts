import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { Kind, FieldNode } from 'graphql';
import { GraphQLESTreeNode } from './types';
export const OFFLINE_GRAPHQL_UNSUPPORTED_SCOPE_RULE_ID = 'offline-graphql-unsupported-scope';

export const ASSIGNED_TO_ME_SUPPORTED_FOR_SERVICEAPPOINTMENT_ONLY =
    'ASSIGNED_TO_ME__SERVICEAPPOINTMENT_ONLY';
export const OTHER_UNSUPPORTED_SCOPE = 'OTHER_UNSUPPORTED_SCOPE';
export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        docs: {
            description: `For mobile offline use cases, scope "ASSIGNEDTOME" is only supported for ServiceAppointment . All other unsupported scopes are team, queue-owned, user-owned and everything. `,
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
            [ASSIGNED_TO_ME_SUPPORTED_FOR_SERVICEAPPOINTMENT_ONLY]:
                'Offline GraphQL: Scope ‘ASSIGNEDTOME’ is only supported for the ServiceAppointment entity, for mobile offline use cases',
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
                        if (
                            scopeName === 'TEAM' ||
                            scopeName === 'QUEUE_OWNED' ||
                            scopeName === 'USER_OWNED' ||
                            scopeName === 'EVERYTHING'
                        ) {
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
                        } else if (node.value.value === 'ASSIGNEDTOME') {
                            const entityNode = node.parent as GraphQLESTreeNode<FieldNode>;
                            if (
                                entityNode.name.kind === Kind.NAME &&
                                entityNode.name.value !== 'ServiceAppointment'
                            ) {
                                context.report({
                                    messageId: ASSIGNED_TO_ME_SUPPORTED_FOR_SERVICEAPPOINTMENT_ONLY,
                                    loc: {
                                        start: node.loc.start,
                                        end: node.value.loc.end
                                    }
                                });
                            }
                        }
                    }
                }
            }
        };
    }
};
