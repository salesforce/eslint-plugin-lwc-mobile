/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import createRule from '../../util/createRule';

export default createRule({
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value.startsWith('@salesforce/apex')) {
                    context.report({
                        node,
                        messageId: 'message'
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
            message: 'Importing apex modules can have issues on mobile for offline usage.'
        },
        type: 'suggestion',
        schema: []
    },
    defaultOptions: []
});
