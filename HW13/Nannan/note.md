1. What is GraphQL?
GraphQL is a query language and runtime for APIs, developed by Meta. Instead of hitting multiple REST endpoints, the client sends one query describing exactly what data it wants, and the server returns just that. It's a flexible alternative to REST, especially useful when the frontend has varying data needs.

2. What are the features of GraphQL?
Three big ones: clients ask for exactly the fields they need — no more, no less. It's strongly typed via a schema, so we get autocomplete and validation. And it exposes a single endpoint that can fetch related data in one round trip. Plus real-time updates via subscriptions.

3. What is the difference between GraphQL and REST?
REST has multiple endpoints, one per resource, and the server decides the response shape. GraphQL has one endpoint, and the client shapes its own response. REST often over- or under-fetches; GraphQL fetches exactly what's asked. But GraphQL has a steeper learning curve and caching is trickier since everything is a POST.

4. What is overfetching?
Overfetching is when the API returns more data than the client actually needs — like getting a user's entire profile when we only wanted the name. It wastes bandwidth and slows things down, especially on mobile. GraphQL solves it by letting the client specify exactly which fields to return.

5. What is a GraphQL schema?
The schema is the contract between the client and the server — it defines all the types, queries, mutations, and subscriptions available. It's written in Schema Definition Language, SDL. Both sides rely on it — the server validates requests against it, and the client uses it for autocomplete and type generation.

6. List the data types in GraphQL.
GraphQL has five kinds of types: scalars like Int, Float, String, Boolean, ID; object types with fields; enums for a fixed set of values; interfaces and unions for polymorphism; and input types for arguments. Plus we can mark any type as non-null with ! or as a list with brackets.

7. What are scalar types in GraphQL?
Scalars are the primitive leaf types — they can't be broken down further. The built-in ones are Int, Float, String, Boolean, and ID. We can also define custom scalars for things like DateTime, JSON, or Email, with our own parsing and validation logic.

8. List the operations in GraphQL and explain each of them.
There are three: query for reading data — like GET in REST; mutation for modifying data — like POST, PUT, or DELETE; and subscription for real-time updates over a WebSocket, so the client gets pushed data when something changes. Queries can run in parallel, but mutations run in sequence.

9. What are GraphQL variables and how do you use them?
Variables are parameters we pass to a query so it's reusable and safer. We declare them at the top of the operation, like query GetUser($id: ID!), then use them inside — user(id: $id). We pass the actual values in a separate variables object in the request. It's the GraphQL equivalent of prepared statements.

10. What is the difference between using variables and hardcoding values directly inside the query?
Hardcoding means the value is embedded in the query string, so we have to rebuild the string for every different value — messy and unsafe. Variables keep the query static and pass values separately, so it's reusable, cacheable, and safer against injection. It's always better to use variables in production code.

11. Describe how you would fetch data with a GraphQL query.
We send a POST request to the GraphQL endpoint with a JSON body containing the query string and optional variables. On the client, we typically use a library like Apollo Client, urql, or Relay — but a plain fetch works too. Then we get back a JSON response with a data field and optionally an errors field.

12. Why are GraphQL requests usually sent with POST?
Because the query itself goes in the request body, and GET requests have URL length limits and don't traditionally have bodies. POST also avoids caching issues and keeps the query hidden from browser history and server logs. GraphQL does support GET for simple queries, mostly to enable HTTP caching, but POST is the standard.

13. Why does the body in fetch need JSON.stringify(...)?
Because fetch sends the body as a string over the network — it doesn't automatically serialize objects. If we pass a raw object, it just becomes the string [object Object]. JSON.stringify converts our JavaScript object into a proper JSON string that the server can parse.

14. Why do we need to set Content-Type: application/json?
The header tells the server how to interpret the request body. Without it, the server might treat the body as plain text or form data and fail to parse the JSON. Setting application/json explicitly tells the server "hey, this is JSON, parse it that way".

15. What is the relationship between a GraphQL query and the JSON request body?
The query itself is just a string — GraphQL syntax, not JSON. We wrap it inside a JSON body under a query key, alongside optional variables and operationName keys. So the body looks like { "query": "query { user { name } }", "variables": {} }. The JSON is the envelope, the query is the payload.

16. What is the difference between a network error and a GraphQL error?
A network error means the request itself failed — server unreachable, DNS failure, 500 status, no response. A GraphQL error means the request succeeded — we got a 200 back — but something went wrong inside, like an invalid field or a resolver throwing. GraphQL errors show up in the errors array of the response, and often partial data is returned alongside.

17. How does GraphQL handle caching?
HTTP caching is tricky because everything is a POST to one endpoint. So GraphQL clients like Apollo do caching on the client side — they normalize responses by object ID and store them in an in-memory cache. Future queries that need the same data can be served from the cache without hitting the network. It's more work than REST caching, but more powerful once set up.

18. What is a persisted query?
A persisted query is when the client and server agree on a set of pre-registered queries identified by a hash. Instead of sending the full query string, the client sends just the hash. Benefits are smaller payloads, better security since only approved queries can run, and it enables HTTP GET caching. It's common in production Apollo setups.

19. What is the N+1 query issue in GraphQL?
N+1 happens when we fetch a list of items — that's one query — and then for each item, the resolver fires another query to fetch related data. So for a list of N users with their posts, we end up with N+1 database calls. The standard fix is DataLoader, which batches and caches these requests within a single execution cycle.
