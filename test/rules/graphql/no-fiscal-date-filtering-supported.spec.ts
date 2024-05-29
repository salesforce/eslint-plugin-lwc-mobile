import {
    rule,
    NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID
} from '../../../src/rules/graphql/no-fiscal-date-filtering-supported';

import { ruleTester } from '../../shared';

ruleTester.run('@salesforce/lwc-mobile/no-fiscal-date-filtering-supported', rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                {
                    uiapi {
                        query {
                            Account(where: { LastActivityDate: { eq: { literal: THIS_YEAR } } }) {
                                edges {
                                    node {
                                        Id
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
                {
                    uiapi {
                        query {
                            Account(
                                where: {
                                    LastActivityDate: { eq: { range: { last_n_fiscal_years: 1 } } }
                                }
                            ) {
                                edges {
                                    node {
                                        Id
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID,
                    data: {
                        filterType: 'range',
                        filterName: 'last_n_fiscal_years'
                    }
                }
            ]
        },
        {
            code: /* GraphQL */ `
                {
                    uiapi {
                        query {
                            Account(
                                where: { LastActivityDate: { eq: { literal: THIS_FISCAL_YEAR } } }
                            ) {
                                edges {
                                    node {
                                        Id
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID,
                    data: {
                        filterType: 'literal',
                        filterName: 'THIS_FISCAL_YEAR'
                    }
                }
            ]
        }
    ]
});
