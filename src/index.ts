/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import base from './configs/base.js';
import recommended from './configs/recommended.js';
import enforceFooBar from './rules/dummy/enforce-foo-bar.js';
import {
    rule as mutionNotSupported,
    NO_MUTATION_SUPPORTED_RULE_ID
} from './rules/graphql/no-mutation-supported.js';
import { name, version } from '../package.json';
export = {
    configs: {
        base,
        recommended
    },
    meta: {
        name,
        version
    },
    rules: {
        'enforce-foo-bar': enforceFooBar,
        [NO_MUTATION_SUPPORTED_RULE_ID]: mutionNotSupported
    }
};
