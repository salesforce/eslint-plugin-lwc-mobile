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
    NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID,
    rule as aggregateQueryNotSupported
} from './rules/graphql/no-aggregate-query-supported.js';

import {
    NO_MUTATION_SUPPORTED_RULE_ID,
    rule as mutationNotSupported
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
        [NO_MUTATION_SUPPORTED_RULE_ID]: mutationNotSupported,
        [NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID]: aggregateQueryNotSupported
    }
};
