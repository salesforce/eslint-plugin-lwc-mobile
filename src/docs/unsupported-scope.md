# unsupported-scope

This rule flags the use of scopes other than "MINE" and "ASSIGNEDTOME" with GraphQL. Currently, "MINE" is supported for all entities and "ASSIGNEDTOME" is supported for ServiceAppoinment. No other scopes are supported for GraphQL offline use cases.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
query assignedtomeQuery {
    uiapi {
        query {
            Case(scope: ASSIGNEDTOME) {
                edges {
                    node {
                        Id
                    }
                }
            }
        }
    
}

```
