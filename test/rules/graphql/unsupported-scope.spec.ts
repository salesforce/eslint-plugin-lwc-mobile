import { RuleTester } from '@typescript-eslint/rule-tester';
import {
    rule,
    ASSIGNED_TO_ME_SUPPORTED_FOR_SERVICEAPPOINTMENT_ONLY,
    OTHER_UNSUPPORTED_SCOPE
} from '../../../src/rules/graphql/unsupported-scope';
import { RULE_TESTER_CONFIG } from '../../shared';

const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run('@salesforce/lwc-mobile/offline-graphql-unsupported-scope', rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query scopeQuery {
                    uiapi {
                        query {
                            ServiceAppointment(first: 20, scope: ASSIGNEDTOME) {
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
                query scopeQuery {
                    uiapi {
                        query {
                            Case(scope: EVERYTHING) {
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
                    messageId: OTHER_UNSUPPORTED_SCOPE,
                    data: {
                        scopeName: 'EVERYTHING'
                    }
                }
            ]
        },
        {
            code: /* GraphQL */ `
                query scopeQuery {
                    uiapi {
                        query {
                            Case(first: 20, scope: ASSIGNEDTOME) {
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
            `,
            errors: [{ messageId: ASSIGNED_TO_ME_SUPPORTED_FOR_SERVICEAPPOINTMENT_ONLY }]
        }
    ]
});
