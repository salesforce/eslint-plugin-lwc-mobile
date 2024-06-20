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
                'Using Apex in LWC Offline-enabled mobile apps requires additional considerations to ensure proper functioning in offline scenarios. See https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/apex.htm for more details.'
        },
        messages: {
            [APEX_IMPORT_RULE_ID]:
                'Using Apex in LWC Offline-enabled mobile apps requires careful consideration.'
        },
        type: 'suggestion',
        schema: []
    },
    defaultOptions: []
});
