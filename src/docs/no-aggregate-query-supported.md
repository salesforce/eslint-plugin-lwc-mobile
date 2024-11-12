# no-aggregate-query-supported

This rule flags the use of aggregate queries with GraphQL. Currently, aggregate queries with GraphQL are not supported for offline use cases.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
query AvgOpportunityExample {
    uiapi {
        aggregate {
            Opportunity {
                edges {
                    node {
                        aggregate {
                            Amount {
                                avg {
                                    value
                                    displayValue
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

```