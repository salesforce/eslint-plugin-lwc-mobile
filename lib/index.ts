/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import base from './configs/base';
import recommended from './configs/recommended';
import enforceFooBar from './rules/enforce-foo-bar';
export default {
    rules: {
        'enforce-foo-bar': enforceFooBar
    },
    config: {
        base,
        recommended
    }
};
