/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { GraphQLESLintRule, GraphQLESLintRuleContext } from '@graphql-eslint/eslint-plugin';
import { getEntityNodeForEdges, getLocation, getPageSizeFromEntityNode } from '../../util/graphql-ast-utils';
import { Kind } from 'graphql';
import { ObjectUtils } from '../../util/objectUtils';

export const NO_BASE64_FIELD_WITH_100_RECORDS_RULE_ID = 'offline-graphql-no-base64_field_with_100_records';

export const rule: GraphQLESLintRule = {
    meta: {
        type: 'problem',
        hasSuggestions: false,
        docs: {
            category: 'Operations',
            description:
                'Fetch text area field could result in big response, so limit to record count to 100',
            recommended: true,
            examples: [
                {
                    title: 'Correct',
                    code: /* GraphQL */ `
                        query workStepQuery {
                            uiapi {
                                query {
                                    WorkStep {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                                Instructions {
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
                        query workStepQuery {
                            uiapi {
                                query {
                                    WorkStep(first: 101) {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                                Instructions {
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
            [NO_BASE64_FIELD_WITH_100_RECORDS_RULE_ID]:
                'Offline GraphQL: should not fetch more than 100 records when including TextArea field {{objectApiName}}.{{fieldName}}'
        },
        schema: []
    },

    create(context: GraphQLESLintRuleContext) {
        return {
            Field(node) {
                if (node.name.value === 'edges') {
                    const objectNode = getEntityNodeForEdges(node);
                    if (objectNode == null) {
                        return
                    }

                    const pageSize = getPageSizeFromEntityNode(objectNode);
                    if (pageSize <= 100) {
                        return
                    }

                    const objectApiName = objectNode.name.value;

                    if (node.selectionSet && node.selectionSet.selections) {
                        // This is `node` FieldNode
                        const nodeField = node.selectionSet.selections[0];
                        if (nodeField.type === Kind.FIELD) {
                            if (nodeField.selectionSet && nodeField.selectionSet.selections) {
                                for (const fieldNameNode of nodeField.selectionSet.selections) {
                                    if (fieldNameNode.kind === Kind.FIELD) {
                                        const fieldName = fieldNameNode.name.value;
                                        if (ObjectUtils.getFieldType(objectApiName, fieldName) === 'TextArea') {
                                            context.report({
                                                messageId: NO_BASE64_FIELD_WITH_100_RECORDS_RULE_ID,
                                                loc: getLocation(
                                                    fieldNameNode.loc.start,
                                                    fieldName
                                                ),
                                                data: {
                                                    objectApiName,
                                                    fieldName
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
        };
    }
};