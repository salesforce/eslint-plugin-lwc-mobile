import { Kind } from 'graphql';
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import getDocUrl from '../../util/getDocUrl';
export const NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID =
    'offline-graphql-no-fiscal-date-filter-supported';

type NodeWithParent = {
    kind: string;
    parent: NodeWithParent;
};

//visit, ASTNode, ASTVisitor
export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'fiscal date literals/ranges are not supported offline',
            category: 'Operations',
            url: getDocUrl(NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID),
            recommended: true,
            examples: [
                {
                    title: 'InCorrect',
                    code: /* GraphQL */ `
                        {
                            uiapi {
                                query {
                                    Account(
                                        where: {
                                            LastActivityDate: { eq: { literal: THIS_FISCAL_YEAR } }
                                        }
                                    ) {
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
                    title: 'InCorrect',
                    code: /* GraphQL */ `
                        {
                            uiapi {
                                query {
                                    Account(
                                        where: {
                                            LastActivityDate: {
                                                eq: { range: { LAST_N_FISCAL_YEARS: 1 } }
                                            }
                                        }
                                    ) {
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
                    title: 'Correct',
                    code: /* GraphQL */ `
                        {
                            uiapi {
                                query {
                                    Account(
                                        where: {
                                            LastActivityDate: {
                                                eq: { literal: { THIS_YEAR } }
                                            }
                                        }
                                    ) {
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
            [NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID]:
                'Offline GraphQL: Date {{filterType}} "{{filterName}}" is not supported offline.'
        },
        schema: []
    },
    create(context: GraphQLESLintRuleContext) {
        return {
            ObjectField(node) {
                if (node.kind == Kind.OBJECT_FIELD && node.name.kind === Kind.NAME) {
                    // Example: where : {LastAcitivtyDate: {eq: {literal : LAST_FISCAL_YEAR }}}.
                    if (
                        node.name.value === 'literal' &&
                        node.value.kind === Kind.ENUM &&
                        node.value.value.toLowerCase().indexOf('fiscal') > 0 &&
                        isInFilter(node as NodeWithParent)
                    ) {
                        {
                            context.report({
                                messageId: NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID,
                                node: node.value,
                                data: {
                                    filterType: 'literal',
                                    filterName: node.value.value
                                }
                            });
                        }
                    } else if (
                        node.name.value === 'range' &&
                        node.value.kind === Kind.OBJECT &&
                        node.value.fields.length > 0
                    ) {
                        // Example: where : {LastAcitivtyDate: {eq: {range: {LAST_N_FISCAL_YEARS: 1 }}}}.
                        const rangeObjectField = node.value.fields[0];
                        // Checks if it is a fiscal date filter, for example 'LAST_N_FISCAL_QUATERS', 'N_FISCAL_YEARS_AGO'.
                        if (rangeObjectField.name.value.toLowerCase().indexOf('fiscal')) {
                            // const {line, column } = rangeObjectField.loc?.source.locationOffset
                            if (isInFilter(rangeObjectField as NodeWithParent)) {
                                context.report({
                                    messageId: NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID,
                                    node: rangeObjectField,
                                    data: {
                                        filterType: 'range',
                                        filterName: rangeObjectField.name.value
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

function isInFilter(node: NodeWithParent): boolean {
    if (node.kind === Kind.ARGUMENT) {
        return true;
    }
    return node.parent == null ? false : isInFilter(node.parent);
}
