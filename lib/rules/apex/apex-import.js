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
            description: `When a client device is offline, Apex-based features can read data that was cached while online, but changes (writing data) can’t be saved back to the server.`
        },
        fixable: 'code',
        schema: []
    },
    create(context) {
        return {
            ImportDeclaration: (node) => {
                if (node.source.value.startsWith('@salesforce/apex/')) {
                    context.report({
                        node,
                        message: `Importing apex modules can have issue for offline.`
                    });
                }
            }
        };
    }
};
