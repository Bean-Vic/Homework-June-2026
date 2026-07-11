# HW13 Coding Problem 1c - Explain the three `lineItems` list nullability variants

In GraphQL, `!` means non-null. For a list field there are two places `!` can go: on the list itself and on the items inside the list, so the three variants below make different promises to the client.

## `lineItems: [LineItem]!`

The **list itself can never be null**, but the **items inside it can be null**. The server always returns a list (possibly empty, `[]`), but any entry in that list may be `null` — for example `[item1, null, item2]` is valid. The client must null-check each item.

## `lineItems: [LineItem!]`

The **list itself can be null**, but if a list is returned, **no item inside it can be null**. So `null` and `[item1, item2]` are valid, but `[item1, null]` is not. The client must check whether the list exists, but once it does, every entry is guaranteed to be a real `LineItem`.

## `lineItems: [LineItem!]!`

The strictest variant: the **list can never be null AND no item inside it can be null**. The server must always return a list (possibly empty), and every entry is guaranteed to be a `LineItem`. Valid: `[]`, `[item1, item2]`. Invalid: `null`, `[item1, null]`.

This is the variant used in my `schema.graphql`, because an order always has a line-items list and a null entry inside it would be meaningless.

## Summary table

| Declaration        | `null` list allowed? | `null` items allowed? | Example valid values          |
| ------------------ | -------------------- | --------------------- | ----------------------------- |
| `[LineItem]!`      | No                   | Yes                   | `[]`, `[item, null]`          |
| `[LineItem!]`      | Yes                   | No                    | `null`, `[]`, `[item, item]`  |
| `[LineItem!]!`     | No                   | No                    | `[]`, `[item, item]`          |
