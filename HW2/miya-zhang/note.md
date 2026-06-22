## 1. What is CSS?

CSS means Cascading Style Sheets. I think HTML is more like the basic content and structure of a webpage, and CSS is used to make the page look better. For example, it can change colors, fonts, spacing, and layout. Without CSS, the page can still show content, but it may look very plain and not organized.

## 2. What is block element? How is it different from inline and inline-block elements?

A block element takes the full width of its parent container and usually starts on a new line. For example, div, p, and section are block elements. An inline element only takes the space it needs and stays in the same line, like span or a. Inline-block is in between. It stays in the same line like inline, but we can set width and height on it.
So the main difference is how they take space and whether width and height can be controlled.

## 3. What is the difference between pseudo-class and pseudo-element?

A pseudo-class is used to style an element in a certain state. For example, :hover(colon hover) styles an element when the mouse is over it. A pseudo-element is used to style a specific part of an element. For example, ::before(double colon before), ::after, or ::first-letter. I remember it this way: pseudo-class is about state, and pseudo-element is about part of an element.

## 4. What is the difference between the child combinator and the descendant combinator?

The child combinator uses >(greater than sign) and selects only direct children. And the descendant combinator uses a space and selects all nested elements inside, not only direct children. For example, div > p only selects p directly inside div, but div p can select any p inside the div.
So the child combinator is more specific, and the descendant combinator is broader.

## 5. What is the attribute selector? Give some examples.

An attribute selector selects elements based on their attributes. input[type="text"] (input with type equals text) selects text input fields. Another example is a[target="_blank"] (a with target equals blank), which selects links that open in a new tab. It is useful when I want to style elements based on extra information in the HTML.
Actually, attribute selectors help us target elements more precisely.

## 6. What are two ways that we can make an element invisible? What is the difference?

Two common ways are display: none(display colon none) and visibility: hidden. display: none removes the element from the page layout, so it does not take space. And visibility: hidden hides the element, but it still keeps its space on the page. The main difference is whether the element still takes space or not.

## 7. What is the CSS Box Model? Describe each part.

The CSS Box Model describes how an element takes space on a page. It includes content, padding, border, and margin.
Content is the actual text or image. Padding is the space inside the element around the content. Border goes around the padding. Margin is the space outside the element. In fact the box model helps us understand spacing and layout in CSS.

## 8. What is the usage of !important? What are some use cases?

!important(Exclamation important) gives a CSS rule higher priority. If another style is overriding my rule, I can use !important to force my style to apply. But I think it should not be used too often, because it can make CSS harder to maintain. I would only use it when I really need to override a style, like in a quick fix or third-party CSS situation.

## 9. What does z-index do?

z-index controls the stacking order of elements. If elements overlap, the one with a higher z-index usually appears on top. It only works when the element has a position value like relative, absolute, fixed, or sticky.
So I use z-index when I need to control which element appears above another one.

## 10. Can padding and margin be negative?

Margin can be negative, but padding cannot be negative. Negative margin can pull elements closer or move them outside their normal position. Padding is the inside space of an element, so it cannot be less than zero.
The simple answer is: margin can be negative, but padding cannot.

## 11. How do you center a block element with CSS？

I can center a block element by setting a width and using margin: 0 auto. The width gives the element a fixed size, and auto margin makes the left and right sides equal.
For example, .container { width: 500px; margin: 0 auto; }.

## 12. What are grid items? Can you explain some grid item properties?

Grid items are the direct children of a grid container. If a parent has display: grid(display grid), then its direct children are grid items. Some common grid item properties are grid-column, grid-row, justify-self, and align-self.
These properties help control where the item is placed and how it aligns inside the grid.
So grid items are the elements we arrange inside a CSS grid layout.

## 13. What is a flex container? Can you explain some flex container properties?

A flex container is an HTML element that uses display: flex. After I set display: flex on a parent element, the child elements inside it become flex items. Some useful flex container properties are flex-direction, justify-content, align-items, and gap. For example, flex-direction decides if the items go in a row or a column. justify-content can move items left, right, center, or spread them out. align-items is used to align items in the other direction. gap adds space between items.
I think flexbox is useful because it makes layout easier, especially when I want things to line up neatly.

## 14. What is responsive web design? How do we achieve this?

Responsive web design means a website can adjust to different screen sizes, like desktop, tablet, and mobile.
We can achieve it by using flexible layouts, relative units like %, em, rem, media queries, and sometimes Flexbox or Grid. SWe can use media queries to change the layout on smaller screens.
So the goal is to make the website look good and usable on different devices.

## 2. Quiz

W3Schools HTML Quiz: https://www.w3schools.com/html/html_quiz.asp

![HTML Quiz Result](c210167e240ced848154f638183fa56f.png)
