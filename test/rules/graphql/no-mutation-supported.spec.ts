import { RuleTester } from '@typescript-eslint/rule-tester';
import {
    rule,
    NO_MUTATION_SUPPORTED_RULE_ID
} from '../../../src/rules/graphql/no-mutation-supported';

const ruleTester = new RuleTester({
    parser: '@graphql-eslint/eslint-plugin',
    parserOptions: {
        graphQLConfig: {}
    }
});

ruleTester.run('@salesforce/lwc-mobile/no-mutation-supported', rule as any, {
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
