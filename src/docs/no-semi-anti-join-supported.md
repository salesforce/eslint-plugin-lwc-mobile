# no-semi-anti-join-supported

This rule flags the use of semi-join and anti-join filters with GraphQL. Currently, semi-join and anti-join filters with GraphQL are not supported for offline use cases.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
query AccountExample {
    uiapi {
        query {
            Account (where: {
                Id: { inq: {
                    Opportunity: {
                        StageName: { eq: "Closed Won" } },
                        ApiName:"AccountId"
                        }
                    }
                }) {
                    edges {
                        node {
                            Id
                            Name { value }
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
query AccountExample {
    uiapi {
        query {
            Account {
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

```
