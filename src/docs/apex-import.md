# apex-import

Using Apex in LWC Offline-enabled mobile apps requires additional considerations to ensure proper functioning in offline scenarios.

When a client device is offline, Apex-based features can read data that was cached while online, but changes (writing data) can’t be saved back to the server. Nor can a change via Apex methods be enqueued as a draft into the Offline Queue. A Lightning web component that uses Apex must be prepared to handle a network connection error as a normal response, for both reading and writing operations.

See [Use Apex While Mobile and Offline](https://developer.salesforce.com/docs/atlas.en-us.mobile_offline.meta/mobile_offline/apex.htm) for more details.



