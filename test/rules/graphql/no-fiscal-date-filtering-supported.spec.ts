import {
    rule,
    NO_FISCAL_DATE_FILTER_SUPPORTED_RULE_ID
} from '../../../src/rules/graphql/no-fiscal-date-filtering-supported';

import { ruleTester } from '../../shared';

ruleTester.run('@salesforce/lwc-mobile/no-fiscal-date-filtering-supported', rule as any, {
    valid: [],
    invalid: [
        {
            code: /* GraphQL */ `
                {
                    uiapi {
                        query {
                            Account(
                                where: {
                                    LastActivityDate: { eq: { range: { LAST_N_FISCAL_YEARS: 1 } } }
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
                        filterName: 'LAST_N_FISCAL_YEARS'
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
