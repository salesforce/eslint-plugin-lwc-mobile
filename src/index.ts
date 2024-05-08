/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import base from './configs/base.js';
import recommended from './configs/recommended.js';
import enforceFooBar from './rules/enforce-foo-bar.js';
export default {
    rules: {
        'enforce-foo-bar': enforceFooBar
    },
    config: {
        base,
        recommended
    }
};
