import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule, MESSAGE_ID } from '../../../src/rules/graphql/mutation-not-supported';

const ruleTester = new RuleTester({
    parser: '@graphql-eslint/eslint-plugin',
    parserOptions: {
        graphQLConfig: {}
    }
});

ruleTester.run('@salesforce/lwc-mobile/mutation-not-supported', rule as any, {
    valid: [],
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
            errors: [{ messageId: MESSAGE_ID }]
        }
    ]
});
