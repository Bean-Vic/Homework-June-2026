# HW13 GraphQL

- `../note.md`: answers to the GraphQL questions and the explanation of `lineItems` types.
- `schema.graphql`: GraphQL schema based on the order JSON.
- `query.graphql`: configurable GraphQL query to fetch an order by `orderId`.
- `src/RickAndMortyCharacters.jsx`: React page that fetches Rick and Morty characters from the GraphQL API.
- `src/App.jsx`: renders the React page.
- `src/RickAndMortyCharacters.css`: simple styling for the character cards.

The schema includes these types:

- `Customer`
- `Product`
- `LineItem`
- `Order`
- `Query`

I used `lineItems: [LineItem!]!` because an order should always have a list of line items, and every item inside the list should be a valid `LineItem`.

API used:

```text
https://rickandmortyapi.com/graphql
```

The page shows these fields for each character:

- name
- status
- species
- image
- origin name

It also includes:

- `fetch`
- GraphQL variables
- loading state
- error state
- pagination
- search by name

Go to the `coding` folder:

```bash
cd HW13_GraphQL/Miya_Zhang/coding
```

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm run dev
```

Then open the local Vite URL in the browser.
