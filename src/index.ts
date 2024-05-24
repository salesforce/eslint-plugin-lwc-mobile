/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import base from './configs/base.js';
import recommended from './configs/recommended.js';
import { rule as apexImport, APEX_IMPORT_RULE_ID } from './rules/apex/apex-import.js';
import {
    NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID,
    rule as aggregateQueryNotSupported
} from './rules/graphql/no-aggregate-query-supported.js';

import {
    NO_MUTATION_SUPPORTED_RULE_ID,
    rule as mutationNotSupported
} from './rules/graphql/no-mutation-supported.js';

import {
    UNSUPPORTED_SCOPE_RULE_ID,
    rule as unsupportedScope
} from './rules/graphql/unsupported-scope.js';

import {
    NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID,
    rule as fiscalDataFilteringNotSupported
} from './rules/graphql/no-fiscal-date-filtering-supported.js';

import {
    NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID,
    rule as noSemiAntiJoinSupported
} from './rules/graphql/no-semi-anti-join-supported.js';

import {
    NO_MORE_THAN_1_PARENT_RECORD_RULE_ID,
    rule as noMoreThan1ParentRecord
} from './rules/graphql/no-more-than-1-parent-record.js';

import {
    NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID,
    rule as noMoreThan3ChildEntities
} from './rules/graphql/no-more-than-3-child-entities.js';

import {
    NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID,
    rule as noMoreThan3RootEntities
} from './rules/graphql/no-more-than-3-root-entities.js';

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
        [APEX_IMPORT_RULE_ID]: apexImport,
        [NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID]: aggregateQueryNotSupported,
        [NO_MUTATION_SUPPORTED_RULE_ID]: mutationNotSupported,
        [UNSUPPORTED_SCOPE_RULE_ID]: unsupportedScope,
        [NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID]: fiscalDataFilteringNotSupported,
        [NO_SEMI_ANTI_JOIN_SUPPORTED_RULE_ID]: noSemiAntiJoinSupported,
        [NO_MORE_THAN_1_PARENT_RECORD_RULE_ID]: noMoreThan1ParentRecord,
        [NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID]: noMoreThan3ChildEntities,
        [NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID]: noMoreThan3RootEntities
    }
};
