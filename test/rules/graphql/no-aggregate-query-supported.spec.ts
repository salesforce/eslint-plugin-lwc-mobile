import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule } from '../../../src/rules/graphql/no-aggregate-query-supported';

const ruleTester = new RuleTester({
    parser: '@graphql-eslint/eslint-plugin',
    parserOptions: {
        graphQLConfig: {}
    }
});

ruleTester.run('@salesforce/lwc-mobile/no-aggregate-query-supported', rule as any, {
    valid: [],
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
            errors: [{ messageId: 'aggregateQueryNotSupported' }]
        }
    ]
});
