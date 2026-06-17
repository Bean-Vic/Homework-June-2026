1. What is CSS?
SS (Cascading Style Sheets) is a language used to style and layout web pages.
It controls:Colors,Fonts,Spacing,Positioning,Layout

2. What is block element? How is it different from inline, and inline-block elements?
it starts on a new line. It takes up the full available width by default and can set width and height.

Inline Element:(<span><a><strong>)
Does not start on a new line
Cannot set width and height

Inline-Block Element
Stays on the same line like inline
Allows width and height like block

3. What is the difference between pseudo-class and pseudo-element?
psudo-class is a special state of an element, like :hover :focus
pesudo element is a specific part of an element, like ::before ::first-line


4. What is the difference between the child combinator and
the descendant combinator?
Descendant Combinator (space):Selects all <p> elements inside <div>, no matter how deep.
Child Combinator (>):Selects only direct child <p> elements.


5. What is the attribute selector? Give some examples.
It means attribute selectors target elements based on attributes or attribute values.
For exapmle, a[href] selects all links that have an href attribute, input[type="text"] selects text inputs, and img[src$=".png"] selects images whose source ends with .png.

6. What are two ways that we can make an element invisible? What is the
difference?
visibility: hidden: lement is hidden, Space is still reserved
display: none : remove this element from layout

7. What is the CSS Box Model? Describe each part.
Every HTML element is treated as a box.
Content:Actual text or image.
Padding:Space inside the border.
Border:Surrounds padding and content.
Margin:Space outside the border.

8. What is the usage of !important? What are some use cases?
!important gives a CSS rule the highest priority.
It uses to override third-party library styles; Quick fixes for legacy code
But overusing it makes CSS difficult to maintain.

9. What does z-index do?
controls the stacking order of overlapping elements.
Higher value appears on top.
And Works only on positioned elements: like relatives, sticky, fixed

10. Can padding and margin be negative?
padding can not
margin can be. 

11. How do you center a block element with CSS?
    1.margin auto
    2.flexbox to justfy-content:center
    3.Grid  place-items:center

12. What are grid items? Can you explain some grid item properties?
Grid items are direct children inside a grid container.
It contains: grid-column, grid-row, justify-self(Horizontal alignment), align-self（vertical alignment）.

13. What is a flex container? Can you explain some flex container
properties?
A flex container is an element with:  display: flex;
It controls the layout of its flex items.
For example: flex-direction, justify-content(Controls alignment on the main axis),align-items(Controls alignment on the cross axis),flex-wrap(Allows items to move to a new line.),gap(add spcing between items)

14. What is responsive web design? How do we achieve this?
Responsive Web Design means a website adapts to different screen sizes and devices.
1.media queries
2.flexbile layouts:use flx,grid
3.relative units:%,rem, instead of pixels