import {
    rule,
    SCOPE_SUPPORTED_FOR_CERTAIN_ENTITIES_ONLY,
    OTHER_UNSUPPORTED_SCOPE
} from '../../../src/rules/graphql/unsupported-scope';
import { ruleTester } from '../../shared';

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
            errors: [
                {
                    messageId: SCOPE_SUPPORTED_FOR_CERTAIN_ENTITIES_ONLY,
                    data: {
                        scopeName: 'ASSIGNEDTOME',
                        supportedEntities: 'ServiceAppointment'
                    }
                }
            ]
        }
    ]
});
