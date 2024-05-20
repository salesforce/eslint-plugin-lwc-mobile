/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import base from './configs/base.js';
import recommended from './configs/recommended.js';
import enforceFooBar from './rules/dummy/enforce-foo-bar.js';
import { rule as apexImport, APEX_IMPORT_RULE_ID } from './rules/apex/apex-import.js';
import {
    NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID,
    rule as aggregateQueryNotSupported
} from './rules/graphql/no-aggregate-query-supported.js';

import {
    NO_MUTATION_SUPPORTED_RULE_ID,
    rule as mutationNotSupported
} from './rules/graphql/no-mutation-supported.js';
import { name, version } from '../package.json';

import {
    rule as offlineGraphqlUnsupportedScope,
    UNSUPPORTED_SCOPE_RULE_ID
} from './rules/graphql/unsupported-scope.js';

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
        [APEX_IMPORT_RULE_ID]: apexImport,
        [NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID]: aggregateQueryNotSupported,
        [NO_MUTATION_SUPPORTED_RULE_ID]: mutionNotSupported,
        [UNSUPPORTED_SCOPE_RULE_ID]: offlineGraphqlUnsupportedScope
    }
};
