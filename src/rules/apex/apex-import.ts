/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ESLintUtils } from '@typescript-eslint/utils';

export const APEX_IMPORT_RULE_ID = 'lwc-offline-apex-import';

export const rule = ESLintUtils.RuleCreator.withoutDocs({
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value.startsWith('@salesforce/apex')) {
                    context.report({
                        node,
                        messageId: APEX_IMPORT_RULE_ID
                    });
                }
            }
        };
    },
    meta: {
        docs: {
            description:
                'Using Apex in LWC Offline-enabled mobile apps requires additional considerations to ensure proper functioning in offline scenarios. See Use Apex While Mobile and Offline (https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/apex.htm) for more details. GraphQL API is a new paradigm of sending and receiving data. This API allows developers to interact with the Salesforce Platform through GraphQL, a standard query language for APIs and a runtime for fulfilling those queries with your data. Learn more about creating SOQL queries with GraphQL that may work better for mobile offline use cases. https://developer.salesforce.com/docs/platform/graphql/guide/graphql-wire-lwc.html'
        },
        messages: {
            [APEX_IMPORT_RULE_ID]:
                'Using Apex in LWC Offline-enabled mobile apps requires careful consideration in offline scenarios.'
        },
        type: 'suggestion',
        schema: []
    },
    defaultOptions: []
});