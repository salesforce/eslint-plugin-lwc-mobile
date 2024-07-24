/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { rule, NO_BASE64_FIELD_WITH_100_RECORDS_RULE_ID } from '../../../src/rules/graphql/no-base64-field-with-over-100-records';
import { createScopedModuleRuleName } from '../../../src/util/rule-helpers';

import { ruleTester } from '../../shared';

ruleTester.run(createScopedModuleRuleName(NO_BASE64_FIELD_WITH_100_RECORDS_RULE_ID), rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query workStepQuery {
                    uiapi {
                        query {
                            WorkStep {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
                                        }
                                        Instructions {
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
                query workStepQuery {
                    uiapi {
                        query {
                            WorkStep(first: 101) {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
                                        }
                                        Instructions {
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_BASE64_FIELD_WITH_100_RECORDS_RULE_ID,
                    data: {
                        objectApiName: 'WorkStep',
                        fieldName: 'Instructions'
                    }
                }
            ]
        }
    ]
});
