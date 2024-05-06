/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

// TODO: This sample rule would be removed.
// The import-apex rule definition
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description:
                "Importing apex modules can have issue for offline."
        },
        fixable: 'code',
        schema: []
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.includes('apex')) {
                    context.report({
                        node,
                        message:
                            'Watch out for importing apex!'
                    });
                }
            }
        };
    }
};
