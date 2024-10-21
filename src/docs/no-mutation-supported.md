# no-mutation-supported

This rule flags the use of mutations (data modification) with GraphQL. Currently, mutations with GraphQL are not supported for offline use cases.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
mutation AccountExample {
    uiapi {
        AccountCreate(input: { Account: { Name: "Trailblazer Express" } }) {
            Record {
                Id
                Name {
                    value
                }
            }
        }
    }
}

```

## ✅ Correct

```GraphQL
query accountQuery {
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
