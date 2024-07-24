/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
// import { OrgUtils } from '../../util/orgUtils';
// import { getLocation } from '../../util/graphql-ast-utils';
// import { Connection } from '@salesforce/core';
import { getEntityNodeForEdges, getLocation } from '../../util/graphql-ast-utils';
import { Kind } from 'graphql';
import { ObjectUtils } from '../../util/objectUtils';

export const NO_INVALID_FIELD_RULE_ID = 'offline-graphql-no-invalid-field';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description: 'Offline GraphQL: Invalid field of an Object is not accepted',
            recommended: true,
            examples: [
                {
                    title: 'Correct',
                    code: /* GraphQL */ `
                        query accountQuery {
                            uiapi {
                                query {
                                    Account {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
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
                        query accountQuery {
                            uiapi {
                                query {
                                    Account {
                                        edges {
                                            node {
                                                Id
                                                Names {
                                                    value
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
            [NO_INVALID_FIELD_RULE_ID]: 'Offline GraphQL: Field "{{invalidField}}" is invalid for "{{objectApiName}}" object.'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            Field(node) {
                if (node.name.value === 'edges') {
                    const objectNode = getEntityNodeForEdges(node);
                    if (objectNode) {
                        const objectApiName = objectNode.name.value;

                        if (node.selectionSet && node.selectionSet.selections) {
                            // This is `node` FieldNode
                            const nodeField = node.selectionSet.selections[0];
                            if (nodeField.type === Kind.FIELD) {
                                if (nodeField.selectionSet && nodeField.selectionSet.selections) {
                                    for (const fieldNameNode of nodeField.selectionSet.selections) {
                                        if (fieldNameNode.kind === Kind.FIELD) {
                                            const fieldName = fieldNameNode.name.value;
                                            if (!ObjectUtils.isValidField(objectApiName, fieldName)) {
                                                context.report({
                                                    messageId: NO_INVALID_FIELD_RULE_ID,
                                                    loc: getLocation(
                                                        fieldNameNode.loc.start,
                                                        fieldName
                                                    ),
                                                    data: {
                                                        invalidField: fieldName,
                                                        objectApiName
                                                    }
                                                });
                                            }
                                        }
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
