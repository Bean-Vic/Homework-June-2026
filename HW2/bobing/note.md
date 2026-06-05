1. What is CSS?
   1. CSS stands for Cascading Style Sheets.
   2. It is used to set style and layout for web pages.

2. What is a **block element**? How is it different from **inline**, and **inline-block** elements?
   1. **Block element**: starts on a new line and takes full width  
      e.g., `<div> <p> <h1>`
   2. **Inline element**: does not start a new line, it only takes needed width; width/height usually do not work  
      e.g., `<span> <a>`
   3. **Inline-block**: stays inline, but width and height work

3. What is the difference between **pseudo-class** and **pseudo-element**?
   1. Pseudo-class: describes a special state.  
      `:hover :focus :first-child`
   2. Pseudo-element: styles part of an element.  
      `::before ::after ::first-letter`

4. What is the difference between the **child combinator** and the **descendant combinator**?
   1. Descendant combinator:  
      `div p` Selects all `p` inside `div`
   2. Child combinator

   `div > p` Selects only direct children.

5. What is the **attribute selector**? Give some examples.
   1. Attribute selectors select elements by attributes.  
      `input[type="text"]`  
      `a[target="_blank"]`  
      `img[alt]`

6. What are two ways that we can make an **element invisible**? What is the difference?
   1. `display: none`  
      element will be removed from layout  
      takes no space
   2. `visibility: hidden`  
      element invisible  
      still takes space

7. What is the CSS Box Model? Describe each part.
   1. The box model consists of: content, padding, border, margin
   2. Content: Actual text or element content.  
      Padding: Space inside the border.  
      Border: Border around the element.  
      Margin: Space outside the border.

8. What is the usage of `!important`? What are some use cases?
   1. `!important` overrides normal CSS specificity rules.
   2. Use cases:
      1. overriding library styles
      2. forcing high-priority styles

9. What does `z-index` do?
   1. `z-index` controls stacking order.
   2. Higher `z-index` appears on top.
   3. Usually works with: `position: relative/absolute/fixed`

10. Can padding and margin be negative?
   1. `padding` ❌ cannot be negative
   2. `margin` ✅ can be negative

11. How do you **center a block element** with CSS?
   1. `margin: 0 auto`;
   2. `display: flex` for the parent, and `justify-content: center` & `align-items: center` for the element

12. What are **grid items**? Can you explain some **grid item properties**?
   1. Grid items are children inside a grid container.
   2. Common properties:
      1. `grid-column`
      2. `grid-row`
      3. `justify-self`
      4. `align-self`

13. What is a **flex container**? Can you explain some **flex container properties**?
   1. A flex container uses `display: flex;` for flexible layouts.
   2. Common properties:
      1. `justify-content`
      2. `align-items`
      3. `flex-direction`
      4. `gap`
      5. `flex-wrap`

14. What is **responsive web design**? How do we achieve this?
   1. Responsive web design means the UI adapts to different screen sizes.
   2. Common methods:
      1. media queries
      2. flexbox
      3. grid
      4. responsive units (`%`, `rem`, `vw`)
      5. mobile-first design
