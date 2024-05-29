import {
    rule,
    NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID
} from '../../../src/rules/graphql/no-more-than-3-root-entities';
import { createScopedModuleRuleName } from '../../../src/util/createScopedModuleRuleName';

import { ruleTester } from '../../shared';

ruleTester.run(createScopedModuleRuleName(NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID), rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query {
                    uiapi {
                        Contacts {
                            edges {
                                node {
                                    Id
                                }
                            }
                        }
                        Opportunities {
                            edges {
                                node {
                                    Id
                                }
                            }
                        }
                        Cases {
                            edges {
                                node {
                                    Id
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
                query {
                    uiapi {
                        Contacts {
                            edges {
                                node {
                                    Id
                                }
                            }
                        }
                        Opportunities {
                            edges {
                                node {
                                    Id
                                }
                            }
                        }
                        Cases {
                            edges {
                                node {
                                    Id
                                }
                            }
                        }
                        Documents {
                            edges {
                                node {
                                    Id
                                }
                            }
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_MORE_THAN_3_ROOT_ENTITIES_RULE_ID
                }
            ]
        }
    ]
});
