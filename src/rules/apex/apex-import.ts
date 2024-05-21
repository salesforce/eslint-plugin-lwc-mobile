/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import createRule from '../../util/createRule';
export const APEX_IMPORT_RULE_ID = 'apex-import';

export const rule = createRule({
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
    name: 'apex-import',
    meta: {
        docs: {
            description: 'Importing apex modules can have issues on mobile for offline usage.'
        },
        messages: {
            [APEX_IMPORT_RULE_ID]:
                'Importing apex modules can have issues on mobile for offline usage.'
        },
        type: 'suggestion',
        schema: []
    },
    defaultOptions: []
});
