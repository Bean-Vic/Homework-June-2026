## 1. What is GraphQL?

GraphQL is a way for the frontend to ask the backend for data. The nice thing is that the frontend can choose exactly what fields it wants. So instead of getting a large fixed response from an API, I can ask for only the data I need.

## 2. What are the features of GraphQL?

I think the main feature is flexibility. The client can choose the fields it wants. GraphQL also has a schema, so the data structure is clear. It usually uses one endpoint, and it supports reading data, updating data, and real-time updates through queries, mutations, and subscriptions.

## 3. What is the difference between GraphQL and REST?

With REST, we usually have different endpoints for different resources, like /users or /posts. Each endpoint returns a fixed response. With GraphQL, we normally send a query to one endpoint, and the query tells the server what data we want. So GraphQL gives the client more control over the response.

## 4. What is overfetching?

Overfetching is when the backend sends more data than the frontend needs. For example, I only need a user’s name, but the API also sends the user’s email, address, profile, and other information. That can waste bandwidth and make the response heavier. GraphQL helps because I can request only the fields I need.

## 5. What is a GraphQL schema?

A GraphQL schema is like the rulebook for the API. It defines what data types exist, what fields they have, and what operations the client can use. For example, it can define what a User looks like and what queries are available.

## 6. List the data types in GraphQL.

GraphQL has basic scalar types, object types, enum types, list types, non-null types, and input types. In simple words, these types help describe what kind of data the API can receive or return.

## 7. What are scalar types in GraphQL?

Scalar types are the basic types in GraphQL. The common ones are String, Int, Float, Boolean, and ID. For example, a user’s name is usually a String, age can be an Int, and user id can be an ID.

## 8. List the operations in GraphQL and explain each of them.

There are three main operations: query, mutation, and subscription.
A query is for reading data.
A mutation is for changing data, like creating, updating, or deleting something.
A subscription is for real-time updates, like live chat messages or notifications.

## 9. What are GraphQL variables and how do you use them?

    GraphQL variables are values we pass into a query instead of writing the value directly inside the query. For example, if I want to get a user by id, I can use $id as a variable. Then I pass the real id separately. It makes the query easier to reuse.
    Example:

    query GetUser($id: ID!) {

user(id: $id) {
name
email
}
}

## 10. What is the difference between using variables and hardcoding values directly inside the query?

Hardcoding means I write the value directly in the query, like id: "123". Variables mean I keep the query reusable and pass the value separately. In real projects, variables are better because the same query can work with different values.

## 11. Describe how you would fetch data with a GraphQL query.

I would send a request to the GraphQL endpoint, usually using fetch or a client like Apollo. In the request body, I put the GraphQL query, and if needed, I also pass variables. Then the server returns JSON with the data I asked for.

## 12. Why are GraphQL requests usually sent with POST?

They are usually sent with POST because the query and variables are often placed in the request body. GraphQL queries can be long, so putting them in the body is cleaner than putting everything in the URL. Some simple queries can use GET, but POST is more common.

## 13. Why does the body in fetch need JSON.stringify(...)?

Because fetch cannot send a JavaScript object directly as JSON. We need to convert the object into a JSON string first. So when we write JSON.stringify(...), we are turning the query and variables into a format the server can read.

## 14. Why do we need to set Content-Type: application/json?

We set Content-Type: application/json to tell the server that we are sending JSON data. If we don’t set it, the server may not parse the request body correctly.

## 15. What is the relationship between a GraphQL query and the JSON request body?

    The GraphQL query is usually inside the JSON request body. The body normally has a query field, and sometimes a variables field too. So the JSON body is just the format we use to send the GraphQL query to the server.
    Example:

    body: JSON.stringify({

query: `     query GetUser($id: ID!) {
      user(id: $id) {
        name
        email
      }
    }
  `,
variables: {
id: "123"
}
})

## 16. What is the difference between a network error and a GraphQL error?

A network error means the request did not successfully reach the server, or the server could not respond. For example, the server is down, the URL is wrong, or there is an internet issue.
A GraphQL error means the request reached the server, but something went wrong inside GraphQL. For example, the query asks for a field that does not exist, or the resolver has an error.

## 17, How does GraphQL handle caching?

GraphQL itself does not handle caching automatically in a simple way like REST URLs. In real projects, caching is usually handled by tools like Apollo Client or Relay. They can store data on the client side and reuse it, often based on object id and type.

## 18. What is a persisted query?

A persisted query is a query that is saved ahead of time. Instead of sending the full query every time, the client can send a small id or hash. This can reduce request size and also make the API safer, because the server only accepts known queries.

## 19. What is the N+1 query issue in GraphQL?

The N+1 issue happens when GraphQL makes too many database queries for related data. For example, first we get 10 users, and then for each user, we make another query to get their posts. That becomes 1 query plus 10 more queries. If the list is large, it can become slow. A common way to fix it is using batching, like DataLoader.
