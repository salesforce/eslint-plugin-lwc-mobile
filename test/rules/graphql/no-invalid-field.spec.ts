/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { rule, NO_INVALID_FIELD_RULE_ID } from '../../../src/rules/graphql/no-invalid-field';
import { createScopedModuleRuleName } from '../../../src/util/rule-helpers';

import { ruleTester } from '../../shared';

ruleTester.run(createScopedModuleRuleName(NO_INVALID_FIELD_RULE_ID), rule as any, {
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
                query accountQuery {
                    uiapi {
                        query {
                            Account {
                                edges {
                                    node {
                                        Id
                                        Nane {
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
                    messageId: NO_INVALID_FIELD_RULE_ID,
                    data: {
                        invalidField: 'Nane',
                        objectApiName: 'Account'
                    },
                    suggestions: [
                        {
                            messageId: NO_INVALID_FIELD_RULE_ID,
                            output: 'hello'
                        },
                        {
                            messageId: NO_INVALID_FIELD_RULE_ID,
                            output: 'hello'
                        },
                        {
                            messageId: NO_INVALID_FIELD_RULE_ID,
                            output: 'hello'
                        }
                    ]
                }
            ]
        }
    ]
});
