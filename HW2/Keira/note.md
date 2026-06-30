# CSS Notes

## 1. What is CSS?

CSS stands for **Cascading Style Sheets**.

It is used to style HTML elements, such as:

- colors
- fonts
- spacing
- layout
- borders
- responsiveness

Example:

```css
p {
  color: blue;
  font-size: 16px;
}
```

---

## 2. What is a block element? How is it different from inline and inline-block elements?

A **block element** takes up the full width available and starts on a new line.

Examples:

```html
<div></div>
<p></p>
<section></section>
```

### Differences

| Type | Starts on new line? | Takes full width? | Can set width/height? |
|---|---:|---:|---:|
| `block` | Yes | Yes | Yes |
| `inline` | No | No | No, usually ignored |
| `inline-block` | No | No | Yes |

Example:

```css
.block {
  display: block;
}

.inline {
  display: inline;
}

.inline-block {
  display: inline-block;
  width: 100px;
  height: 50px;
}
```

---

## 3. What is the difference between pseudo-class and pseudo-element?

A **pseudo-class** styles an element based on its state.

Example:

```css
a:hover {
  color: red;
}
```

A **pseudo-element** styles a specific part of an element.

Example:

```css
p::first-letter {
  font-size: 32px;
}
```

### Main difference

- Pseudo-class: targets a **state**.
- Pseudo-element: targets a **part** of an element.

---

## 4. What is the difference between the child combinator and descendant combinator?

The **child combinator** `>` selects only direct children.

```css
div > p {
  color: red;
}
```

This selects only `<p>` elements directly inside a `<div>`.

The **descendant combinator** uses a space and selects all nested descendants.

```css
div p {
  color: blue;
}
```

This selects all `<p>` elements inside a `<div>`, even if they are deeply nested.

---

## 5. What is the attribute selector? Give some examples.

An **attribute selector** selects elements based on their attributes or attribute values.

Examples:

```css
input[type="text"] {
  border: 1px solid gray;
}
```

```css
a[target="_blank"] {
  color: green;
}
```

```css
img[alt] {
  border: 2px solid black;
}
```

```css
a[href^="https"] {
  color: purple;
}
```

Common patterns:

| Selector | Meaning |
|---|---|
| `[alt]` | Has an `alt` attribute |
| `[type="text"]` | Attribute equals `text` |
| `[href^="https"]` | Starts with `https` |
| `[href$=".pdf"]` | Ends with `.pdf` |
| `[class*="btn"]` | Contains `btn` |

---

## 6. What are two ways that we can make an element invisible? What is the difference?

### `display: none`

```css
.hidden {
  display: none;
}
```

The element disappears and does **not** take up space.

### `visibility: hidden`

```css
.invisible {
  visibility: hidden;
}
```

The element disappears but still **takes up space**.

### Difference

| Property | Visible? | Takes space? |
|---|---:|---:|
| `display: none` | No | No |
| `visibility: hidden` | No | Yes |

---

## 7. What is the CSS Box Model? Describe each part.

The **CSS Box Model** describes how every HTML element is treated as a box.

From inside to outside:

1. **Content**: the actual text or image.
2. **Padding**: space between content and border.
3. **Border**: line around the padding and content.
4. **Margin**: space outside the border.

Example:

```css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}
```

---

## 8. What is the usage of `!important`? What are some use cases?

`!important` forces a CSS rule to have higher priority.

Example:

```css
p {
  color: red !important;
}
```

Use cases:

- overriding third-party CSS
- quick debugging
- utility classes
- emergency fixes

But it should be used carefully because it makes CSS harder to override later.

---

## 9. What does `z-index` do?

`z-index` controls the stacking order of elements on the page.

An element with a higher `z-index` appears in front of an element with a lower `z-index`.

Example:

```css
.box1 {
  position: absolute;
  z-index: 1;
}

.box2 {
  position: absolute;
  z-index: 10;
}
```

`.box2` appears above `.box1`.

Note: `z-index` usually works on positioned elements, such as:

```css
position: relative;
position: absolute;
position: fixed;
position: sticky;
```

---

## 10. Can padding and margin be negative?

### Margin

Margin **can** be negative.

```css
.box {
  margin-top: -10px;
}
```

This can pull elements closer together or make them overlap.

### Padding

Padding **cannot** be negative.

```css
.box {
  padding: -10px; /* invalid */
}
```

---

## 11. How do you center a block element with CSS?

To center a block element horizontally:

```css
.box {
  width: 300px;
  margin: 0 auto;
}
```

This works when the element has a fixed or limited width.

Another modern method:

```css
.parent {
  display: flex;
  justify-content: center;
}
```

To center both horizontally and vertically:

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

---

## 12. What are grid items? Can you explain some grid item properties?

A **grid item** is a direct child of a grid container.

Example:

```css
.container {
  display: grid;
}
```

```html
<div class="container">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

`Item 1` and `Item 2` are grid items.

### Common grid item properties

```css
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  justify-self: center;
  align-self: center;
}
```

| Property | Meaning |
|---|---|
| `grid-column` | Controls which columns the item occupies |
| `grid-row` | Controls which rows the item occupies |
| `justify-self` | Aligns item horizontally inside its grid cell |
| `align-self` | Aligns item vertically inside its grid cell |
| `grid-area` | Gives the item a named area or row/column placement |

---

## 13. What is a flex container? Can you explain some flex container properties?

A **flex container** is an element with:

```css
.container {
  display: flex;
}
```

Its direct children become **flex items**.

### Common flex container properties

```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
```

| Property | Meaning |
|---|---|
| `flex-direction` | Main direction: `row`, `column`, `row-reverse`, `column-reverse` |
| `justify-content` | Aligns items along the main axis |
| `align-items` | Aligns items along the cross axis |
| `gap` | Space between flex items |
| `flex-wrap` | Allows items to wrap onto new lines |

---

## 14. What is responsive web design? How do we achieve this?

**Responsive web design** means a website looks good on different screen sizes, such as phones, tablets, and desktops.

We achieve this by using:

1. **Flexible layouts**

```css
.container {
  width: 90%;
  max-width: 1200px;
}
```

2. **Media queries**

```css
@media (max-width: 600px) {
  .container {
    flex-direction: column;
  }
}
```

3. **Flexible units**

Examples:

```css
width: 80%;
font-size: 2rem;
padding: 5vw;
```

4. **Responsive images**

```css
img {
  max-width: 100%;
  height: auto;
}
```

5. **Flexbox and Grid**

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

---

## Quick Summary

- CSS styles HTML.
- Block elements start on a new line and take full width.
- Inline elements stay in the same line.
- Inline-block elements stay inline but can have width and height.
- Pseudo-classes target states like `:hover`.
- Pseudo-elements target parts like `::first-letter`.
- `display: none` removes the element from layout.
- `visibility: hidden` hides it but keeps its space.
- The box model is content, padding, border, and margin.
- `z-index` controls stacking order.
- Margin can be negative; padding cannot.
- Flexbox and Grid are common layout systems.
- Responsive design makes websites work well on different screen sizes.
