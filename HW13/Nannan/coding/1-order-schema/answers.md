# Explain: lineItems nullability variations

## 1. `lineItems: [LineItem]!`
- The **list itself** is non-null → the field will always return an array, never `null`.
- But **each item inside** the array can be `null`.
- Example valid response: `[null, { id: "LI-001", ... }]`
- Use case: when you can guarantee a list exists but some elements might be missing.

## 2. `lineItems: [LineItem!]`
- The **list itself** can be `null` → the field may return `null` entirely.
- But if a list is returned, **every item inside must be non-null**.
- Example valid responses: `null` OR `[{ id: "LI-001", ... }, { id: "LI-002", ... }]`
- Use case: optional relationship where, if data exists, it is always clean.

## 3. `lineItems: [LineItem!]!`  ← what we use in this schema
- **Both** the list and each item are non-null.
- The field always returns an array (possibly empty `[]`), and every element is a real `LineItem`.
- This is the strictest and most explicit form.
- Use case: a list that is guaranteed to exist (even if empty) and contains only valid objects — perfect for `lineItems` on an order.
