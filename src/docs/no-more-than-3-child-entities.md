# no-more-than-3-child-entities

This rule flags queries that fetch more than 3 child entities. To resolve this error, do not fetch more than 3 child entities.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
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

```

## ✅ Correct

```GraphQL
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

```
