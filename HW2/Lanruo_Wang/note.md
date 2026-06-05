# HW2

## 1. What is CSS?

CSS stands for Cascading Style Sheets. It is used to control the style and layout of a web page, such as colors, fonts, spacing, size, position, and responsive design. HTML defines the structure, and CSS defines how it looks.

## 2. What is block element? How is it different from inline and inline-block elements?

A block element takes the full width of its parent container and starts on a new line. Examples are `div`, `p`, and `section`.

An inline element only takes the space it needs and does not start on a new line. Examples are `span` and `a`.

An inline-block element stays inline, but we can set its width and height like a block element.

## 3. What is the difference between pseudo-class and pseudo-element?

A pseudo-class selects an element in a specific state, like `:hover`, `:focus`, or `:first-child`.

A pseudo-element selects and styles a specific part of an element, like `::before`, `::after`, or `::first-line`.

For example, `button:hover` styles a button when the mouse is over it, and `p::first-line` styles the first line of a paragraph.

## 4. What is the difference between the child combinator and the descendant combinator?

The child combinator `>` selects only direct children.

The descendant combinator, written as a space, selects all nested descendants.

For example, `div > p` only selects `p` elements that are direct children of `div`, while `div p` selects all `p` elements inside the `div`, no matter how deeply nested they are.

## 5. What is the attribute selector? Give some examples.

An attribute selector selects elements based on their attributes or attribute values.

Examples:

`input[type="text"]` selects text input fields.

`a[target="_blank"]` selects links that open in a new tab.

`img[alt]` selects images that have an `alt` attribute.

It is useful when we want to style elements based on specific HTML attributes.

## 6. What are two ways that we can make an element invisible? What is the difference?

Two common ways are `display: none` and `visibility: hidden`.

`display: none` removes the element from the page layout, so it takes no space.

`visibility: hidden` hides the element visually, but it still takes up space in the layout.

## 7. What is the CSS Box Model? Describe each part.

The CSS Box Model describes how an element is sized and spaced.

It includes four parts: content, padding, border, and margin.

Content is the actual text or image. Padding is the space between the content and the border. Border surrounds the padding and content. Margin is the space outside the border, separating the element from other elements.

## 8. What is the usage of !important? What are some use cases?

`!important` gives a CSS rule higher priority and makes it override normal rules.

For example:

`color: red !important;`

It can be useful when overriding third-party library styles or urgent temporary fixes. But I should avoid using it too often because it makes CSS harder to maintain and debug.

## 9. What does z-index do?

`z-index` controls the stacking order of positioned elements.

An element with a higher `z-index` appears in front of an element with a lower `z-index`.

It usually works on elements with position values like `relative`, `absolute`, `fixed`, or `sticky`.

## 10. Can padding and margin be negative?

Margin can be negative. Negative margin can move an element closer to or overlap with other elements.

Padding cannot be negative. Padding represents inner space inside an element, so it must be zero or positive.

## 11. How do you center a block element with CSS?

For horizontal centering, I can set a fixed width and use `margin: 0 auto`.

Example:

`width: 300px; margin: 0 auto;`

For both horizontal and vertical centering, I often use Flexbox:

`display: flex; justify-content: center; align-items: center;`

## 12. What are grid items? Can you explain some grid item properties?

Grid items are the direct children of a CSS grid container.

Some common grid item properties are `grid-column`, `grid-row`, `grid-area`, `justify-self`, and `align-self`.

For example, `grid-column: 1 / 3` means the item starts at grid line 1 and ends at grid line 3.

## 13. What is a flex container? Can you explain some flex container properties?

A flex container is an element with `display: flex`.

Its direct children become flex items.

Common flex container properties include `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, and `gap`.

For example, `justify-content: center` centers items horizontally, and `align-items: center` centers them vertically.

## 14. What is responsive web design? How do we achieve this?

Responsive web design means the page can adapt to different screen sizes, such as desktop, tablet, and mobile.

We can achieve it with flexible layouts, relative units like `%`, `rem`, and `vw`, Flexbox, CSS Grid, responsive images, and media queries.

For example, we can use `@media (max-width: 768px)` to apply different styles on smaller screens.
