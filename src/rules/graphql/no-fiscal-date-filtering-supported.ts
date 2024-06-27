/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { ASTNode, Kind, ArgumentNode } from 'graphql';
import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { getClosestAncestorByType } from '../../util/graphql-ast-utils';
import { GraphQLESTreeNode } from '@graphql-eslint/eslint-plugin/estree-converter/types';
export const NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID =
    'offline-graphql-no-fiscal-date-filter-supported';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Fiscal date literals and ranges are not supported in filters for mobile offline. See Feature Limitations of Offline GraphQL (https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.',
            category: 'Operations',
            recommended: true,
            examples: [
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
                },
                {
                    title: 'Incorrect',
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
                    title: 'Incorrect',
                    code: /* GraphQL */ `
                        {
                            uiapi {
                                query {
                                    Account(
                                        where: {
                                            LastActivityDate: {
                                                eq: { range: { last_n_fiscal_years: 1 } }
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
                'Offline GraphQL: Date {{filterType}} "{{filterName}}" is not supported for mobile offline.'
        },
        schema: []
    },
    create(context: GraphQLESLintRuleContext) {
        return {
            ObjectField(node) {
                if (node.kind == Kind.OBJECT_FIELD && node.name.kind === Kind.NAME) {
                    // Handles literal. Example: where : {LastAcitivtyDate: {eq: {literal : LAST_FISCAL_YEAR }}}.
                    if (
                        node.name.value === 'literal' &&
                        node.value.kind === Kind.ENUM &&
                        node.value.value.indexOf('_FISCAL_') > 0 &&
                        isInFilter(node)
                    ) {
                        context.report({
                            messageId: NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID,
                            node: node.value,
                            data: {
                                filterType: 'literal',
                                filterName: node.value.value
                            }
                        });
                        return;
                    }
                    //Handles ranges. Example: where : {LastAcitivtyDate: {eq: {range: {last_n_fiscal_years: 1 }}}}.
                    if (
                        node.name.value === 'range' &&
                        node.value.kind === Kind.OBJECT &&
                        node.value.fields.length > 0
                    ) {
                        const rangeObjectField = node.value.fields[0];
                        // Checks if it is a fiscal date filter, for example 'last_n_fiscal_quarters', 'n_fiscal_years_ago'.
                        if (
                            rangeObjectField.name.value.indexOf('_fiscal_') > 0 &&
                            isInFilter(rangeObjectField)
                        ) {
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
        };
    }
};

function isInFilter<T extends ASTNode>(node: GraphQLESTreeNode<T>): boolean {
    const argument = getClosestAncestorByType<T, ArgumentNode>(node, Kind.ARGUMENT);
    if (argument === undefined) {
        return false;
    }

    return argument.name.value === 'where';
}
