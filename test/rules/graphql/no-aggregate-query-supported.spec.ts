/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import {
    rule,
    NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID
} from '../../../src/rules/graphql/no-aggregate-query-supported';
import { createScopedModuleRuleName } from '../../../src/util/rule-helpers';

import { ruleTester } from '../../shared';

ruleTester.run(createScopedModuleRuleName(NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID), rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query accountQuery {
                    uiapi {
                        query {
                            Account {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `
        }
    ],
    invalid: [
        {
            code: /* GraphQL */ `
                query AvgOpportunityExample {
                    uiapi {
                        aggregate {
                            Opportunity {
                                edges {
                                    node {
                                        aggregate {
                                            Amount {
                                                avg {
                                                    value
                                                    displayValue
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: [{ messageId: NO_AGGREGATE_QUERY_SUPPORTED_RULE_ID }]
        }
    ]
});
