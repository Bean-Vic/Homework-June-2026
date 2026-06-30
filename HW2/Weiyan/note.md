# Interview Questions on CSS

## 1. What is CSS?

 CSS stands for Cascading Style Sheets, it is the language we use to style an HTML document. It describes how HTML elements should be displayed.

## 2. What is block element? How is it different from inline, and inline-block elements?

 A block element takes up the entire width of its container, and it always starts on a new line, and block elements stack on top of each other. You cannot set a custom width or height on them.

 Inline elements do not start on a new line. They sit side-by-side with other inline elements or text.

 Inline-block elements, like inline elements, they do not start on a new line. They sit side-by-side. But you can set custom width and height on them.

## 3. What is the difference between pseudo-class and pseudo-element?

 A pseudo-class targets an entire element, but only when it is in a specific state or meets a certain condition.

 A pseudo-element doesn't care about the state of the element. Instead, it allows you to target a specific sub-part of an element.

## 4. What is the difference between the child combinator and the descendant combinator?

 A child combinator selects all elements that are the direct children of a specified element. While a descendant combinator selects all elements that are descendants of this specified element, regardless of the level of nestings.

## 5. What is the attribute selector? Give some examples

 The attribute selector lets you selelct HTML elements based on the presence or the value of a given attribute.

 For example, we can use square bracket `[required]` to select all elements, essentially all input elements that is required to be filled out, and we can apply properties to these elements at once.

 Or we can use square bracket `[type="password"]` to select all elements, especially input elements whose type is `"password"`.

## 6. What are two ways that we can make an element invisible? What is the difference?

 You can either set the `display` property to `none` or set the `visibility` property to `hidden`.

 If you use `display: none;`, it skips the element from the flow, and the browser will not render it, and its place will be taken by other elements. If you use `visibility: hidden;`, the element becomes invisible, but it still takes up the exact same space on the page, so that it will not affect the overall layout.

## 7. What is the CSS Box Model? Describe each part

 The box model models every HTML element as a rectangular box. The innermost box is the content box, it is where the actual content lives. Immediately surrounding the content box is the padding, it is the cushion between the content and the element's border.

 So that round the padding is border, it is a line of certain weight that wraps tightly around the padding. The content box, the padding and the content defines the exact edge of the element.

 Beyond border is margin, it is not about the element itself, it is about the distance to other elements.

## 8. What is the usage of `!important`? What are some use cases?

 You can append `!important` to the end of a CSS property value so that this setting overides all previous styling rules for this specific property on this element.

 I will use `!important` when the project is mostly styled with Tailwind and I want to bypass the Tailwind style. And actually when I am debugging, or investigating something unexpected, I will use`!important` temporarily to test if the selector is actually targeting at the correct element.

## 9. What does z-index do?

 `z-index` sets the order or priority of elements in the situation that they may overlap, vertically. The higher the number of `z-index`, the closer the element will be to the front.

## 10. Can padding and margin be negative?

 Margin can be negative. Negative margins simply pull the element in the opposite direction of what a positive margin would do.

 Paddings cannot be negative, because padding represents the space inside an element's border, around the content. So when you try to set it to negative, it will be flagged and treated as 0.

## 11. How do you center a block element with CSS?

 The easiest way is to set its `margin-left` and `margin-right` both to auto; it puts the element in center, horizontally.

 Or you can try setting its parent container to a flex container, and use the `justify-content` property and set its value to `center` so that this block element inside of it will be centered horizontally.

## 12. What are grid items? Can you explain some grid item properties?

 A grid item is a direct child of a grid container. The most important properties for grid items are `grid-column` and `grid-row`, they are used to set the placement and spanning of the grid item in the setup of the grid.

## 13. What is a flex container? Can you explain some flex container properties?

 A flex container is the parent element in a Flexbox layout. It has `flex` or `inline-flex` as its display value, and the elements inside if it become flex items.

 To list some container properties, the very first one is `flex-direction`, it is the direction that the items inside the container should flow; it's also known as the Main Axis. It takes `row` by default, meaning the items flow horizontally from left to right.

 Then there is `justify-content`, it controls how items align themselves along the Main Axis. By default it's `flex-start`, meaning items are packing tightly toward the start of the row, in case we have `row` as the `flex-direction`. Or we can set it to `space-between` or `space-around` so the items are placed more evenly, with space.

 In opposition to `justify-content`, there is `align-items`, that sets how the items align themselves along the Cross Axis.

## 14. What is responsive web design? How do we achieve this?

 Responsive Web Design is the idea of building a single website, while its layout, toghther with its content, automatically adapt to any device, without building a separate "mobile version".

 To achieve responsive design, you first have to add the `"viewport"` setting in the `<head>` section in the HTML file. It tells mobile browsers that this webpage is competible with the width of the device, so do not zoom out.

 In terms of styling, it is recommended to use percentage (%) or rem as the unit of the width of borders and margins, instead of using fixed units like pixels.

 Most important, you can use the Media Queries. Media Query is a function that allows you to apply completely different styling rules based on the size of the user's interface.