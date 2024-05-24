import { RuleTester } from '@typescript-eslint/rule-tester';
import {
    rule,
    NO_MUTATION_SUPPORTED_RULE_ID
} from '../../../src/rules/graphql/no-mutation-supported';
import { createScopedModuleRuleName } from '../../../src/util/createScopedModuleRuleName';

import { RULE_TESTER_CONFIG } from '../../shared';

const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(createScopedModuleRuleName(NO_MUTATION_SUPPORTED_RULE_ID), rule as any, {
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
                mutation AccountExample {
                    uiapi {
                        AccountCreate(input: { Account: { Name: "Trailblazer Express" } }) {
                            Record {
                                Id
                                Name {
                                    value
                                }
                            }
                        }
                    }
                }
            `,
            errors: [{ messageId: NO_MUTATION_SUPPORTED_RULE_ID }]
        }
    ]
});
