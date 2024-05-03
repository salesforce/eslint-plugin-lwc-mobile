/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const base = require('./configs/base');
const recommended = require('./configs/recommended');

const enforceFooBar = require('./rules/enforce-foo-bar');

module.exports = {
    rules: {
        'enforce-foo-bar': enforceFooBar
    },
    config: {
        base,
        recommended
    }
};
