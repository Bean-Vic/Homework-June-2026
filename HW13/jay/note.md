


1. **What is GraphQL?**
   GraphQL is a query language and API runtime that allows clients to request exactly the data they need. The client sends a structured query, and the server returns JSON matching the shape of that query.

2. **What are the features of GraphQL?**
   GraphQL provides strongly typed schemas, client-selected fields, nested data retrieval, variables, reusable fragments, introspection, and support for queries, mutations, and subscriptions through a single API endpoint.

3. **What is the difference between GraphQL and REST?**
   REST usually exposes multiple endpoints for different resources, while GraphQL commonly uses one endpoint and lets the client specify the required data. GraphQL can reduce overfetching and underfetching, but it may require more complex server-side validation, caching, and performance management.

4. **What is overfetching?**
   Overfetching happens when an API returns more data than the client actually needs. For example, a REST endpoint might return a user’s entire profile when the client only needs the user’s name.

5. **What is a GraphQL schema?**
   A GraphQL schema defines the API’s available types, fields, relationships, arguments, and operations. It acts as a contract describing what clients can request and what the server can return.

6. **List the data types in GraphQL.**
   GraphQL supports scalar types, object types, input object types, enum types, interface types, union types, list types, and non-null types. These types define the structure and rules of the API’s data.

7. **What are scalar types in GraphQL?**
   Scalar types represent individual values rather than objects. GraphQL’s built-in scalar types are `Int`, `Float`, `String`, `Boolean`, and `ID`, and developers may also create custom scalars such as `Date` or `Email`.

8. **List the operations in GraphQL and explain each of them.**
   A `query` reads data, a `mutation` creates, updates, or deletes data, and a `subscription` maintains a real-time connection so the server can send updates when an event occurs.

9. **What are GraphQL variables and how do you use them?**
   GraphQL variables allow dynamic values to be passed separately from the query text. You declare each variable with a type in the operation, reference it with `$variableName`, and provide its actual value in the request’s `variables` object.

10. **What is the difference between using variables and hardcoding values directly inside the query?**
    Variables keep the query reusable, cleaner, and safer because changing input values does not require rebuilding the query string. Hardcoded values are written directly into the query and are generally less convenient for dynamic user input.

11. **Describe how you would fetch data with a GraphQL query.**
    Send an HTTP request to the GraphQL endpoint with a JSON body containing the query and optional variables. The server validates and executes the query, then returns a JSON response containing a `data` field and possibly an `errors` field.

12. **Why are GraphQL requests usually sent with `POST`?**
    GraphQL requests often use `POST` because queries and variables can be complex and are easily placed inside a JSON request body. However, read-only GraphQL queries may also be sent with `GET`, especially when HTTP caching is useful.

13. **Why does the `body` in `fetch` need `JSON.stringify(...)`?**
    The `fetch` body must be sent as text or another supported data format, not as a plain JavaScript object. `JSON.stringify(...)` converts the query and variables object into a JSON string that the server can receive and parse.

14. **Why do we need to set `Content-Type: application/json`?**
    The `Content-Type: application/json` header tells the server that the request body contains JSON. This allows the server to parse the body correctly and extract fields such as `query`, `variables`, and `operationName`.

15. **What is the relationship between a GraphQL query and the JSON request body?**
    The GraphQL query is usually stored as a string inside the JSON request body under the `query` property. The body may also contain a `variables` object and an `operationName` identifying which operation should run.

16. **What is the difference between a network error and a GraphQL error?**
    A network error means the request failed at the HTTP or connection level, such as a timeout or unavailable server. A GraphQL error means the server received the request but could not fully execute it, and these errors are usually returned in the response’s `errors` array.

17. **How does GraphQL handle caching?**
    GraphQL does not provide one required caching system. Clients often use normalized caches from libraries such as Apollo Client, while servers may use resolver caching, data-source caching, persisted queries, or HTTP caching for queries sent with `GET`.

18. **What is a persisted query?**
    A persisted query is a GraphQL query that is stored on the server and identified by a hash or ID. The client sends the identifier instead of the entire query, reducing request size and allowing the server to restrict which queries may be executed.

19. **What is the N+1 query issue in GraphQL?**
    The N+1 problem occurs when the server executes one query to retrieve a list and then performs an additional query for every item in that list. It is commonly addressed by batching and caching related database requests with tools such as DataLoader.
