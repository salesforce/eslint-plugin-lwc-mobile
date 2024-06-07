import {
    rule,
    NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID
} from '../../../src/rules/graphql/no-more-than-3-child-entities';
import { createScopedModuleRuleName } from '../../../src/util/rule-helpers';

import { ruleTester } from '../../shared';

ruleTester.run(createScopedModuleRuleName(NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID), rule as any, {
    valid: [
        {
            code: /* GraphQL */ `
                query {
                    uiapi {
                        Account(first: 1) {
                            edges {
                                node {
                                    Id
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
                        Account(first: 1) {
                            edges {
                                node {
                                    Id
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
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: NO_MORE_THAN_3_CHILD_ENTITIES_RULE_ID
                }
            ]
        }
    ]
});
