# apex-import

Using Apex in LWC Offline-enabled mobile apps requires additional considerations to ensure proper functioning in offline scenarios. Consider using GraphQL for mobile offline use cases.

GraphQL is a flexible, powerful query language for accessing record and other data. You can think of GraphQL as SQL for your API, the query language for relational databases.

Developers like GraphQL for modern web applications because, in contrast to many REST and CRUD-oriented APIs, GraphQL allows for expressive queries, with features like filtering and scopes, ordering and aggregation, pagination, and relationship traversal to related records. A single query can retrieve many records, and even records of multiple types. Using fewer queries reduces the number of server requests required to load data, which can improve performance. A GraphQL query can specify precisely and only the fields required for a given component, reducing the amount of data that needs to be transmitted before a page can render.

For mobile developers building apps that work while offline, however, there is only one implementation that matters: Offline GraphQL.

See [Use GraphQL While Mobile and Offline](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/apex.htm) and [GraphQL Wire Adapter for LWC](https://developer.salesforce.com/docs/platform/graphql/guide/graphql-wire-lwc.html) for more details.
