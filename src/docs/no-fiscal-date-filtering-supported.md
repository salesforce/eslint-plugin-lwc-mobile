# no-fiscal-date-filtering-supported

This rule flags filters that use fiscal date literals and ranges with GraphQL. Currently, filters that use fiscal date literals and ranges with GraphQL are not supported for offline use cases.

See [Feature Limitations of Offline GraphQL
](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/use_graphql_limitations.htm) for more details.

## ❌ Incorrect

```GraphQL
{
    uiapi {
        query {
            Account(
                where: {
                    LastActivityDate: {
                        eq: { literal: { THIS_FISCAL_YEAR } }
                    }
                }
            ) {
                edges {
                    node {
                        Id
                    }
                }
            }
        }
    }
}

```

## ✅ Correct

```GraphQL
{
    uiapi {
        query {
            Account(
                where: {
                    LastActivityDate: {
                        eq: { literal: { THIS_YEAR } }
                    }
                }
            ) {
                edges {
                    node {
                        Id
                    }
                }
            }
        }
    }
}

```