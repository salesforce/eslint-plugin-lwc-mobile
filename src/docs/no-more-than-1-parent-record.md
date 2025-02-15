# no-more-than-1-parent-record

For GraphQL queries containing parent records with child entities, Offline GraphQL does not support retrieving more than one parent record using the 'first' argument. To resolve this error, set the parent's 'first' argument value to 1.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
query {
    uiapi {
        Account(first: 100) {
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
                    }
                }
            }
        }
    }

```