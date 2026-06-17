

## 1. What is CSS?
CSS, or Cascading Style Sheets, is used to control the visual style and layout of HTML elements, such as colors, fonts, spacing, and positioning.

## 2. What is a block element? How is it different from inline and inline-block elements?
A block element starts on a new line and takes the full available width, while an inline element only takes the width of its content, and an inline-block element behaves like inline but allows width and height to be set.

## 3. What is the difference between pseudo-class and pseudo-element?
A pseudo-class selects an element based on its state, such as `:hover`, while a pseudo-element styles a specific part of an element, such as `::before` or `::first-line`.

## 4. What is the difference between the child combinator and the descendant combinator?
The child combinator `>` selects only direct children, while the descendant combinator selects all matching nested elements at any level.

## 5. What is the attribute selector? Give some examples.
An attribute selector selects elements based on their attributes or attribute values, such as `[type="text"]`, `[href]`, or `[class^="btn"]`.

## 6. What are two ways that we can make an element invisible? What is the difference?
We can use `display: none` to remove the element from the page layout, or `visibility: hidden` to hide it while still keeping its space.

## 7. What is the CSS Box Model? Describe each part.
The CSS Box Model describes how an element is sized and spaced using content, padding, border, and margin.

## 8. What is the usage of `!important`? What are some use cases?
`!important` forces a CSS rule to override normal specificity, but it should be used carefully, such as when overriding third-party styles or temporary debugging styles.

## 9. What does `z-index` do?
`z-index` controls the stacking order of positioned elements, where a higher value appears in front of a lower value.

## 10. Can padding and margin be negative?
Margin can be negative to pull elements closer or overlap them, but padding cannot be negative.

## 11. How do you center a block element with CSS?
A block element can be horizontally centered by setting a fixed width and using `margin: 0 auto`.

## 12. What are grid items? Can you explain some grid item properties?
Grid items are the direct children of a CSS Grid container, and properties like `grid-column`, `grid-row`, `justify-self`, and `align-self` control their placement and alignment.

## 13. What is a flex container? Can you explain some flex container properties?
A flex container is an element with `display: flex`, and properties like `flex-direction`, `justify-content`, `align-items`, and `gap` control how its child elements are arranged.

## 14. What is responsive web design? How do we achieve this?
Responsive web design means building pages that adapt to different screen sizes, usually using flexible layouts, relative units, media queries, and responsive images.
