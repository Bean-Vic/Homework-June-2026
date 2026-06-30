# HW2 - CSS

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is CSS?
2. What is block element? How is it different from inline, and inline-block elements?
3. What is the difference between pseudo-class and pseudo-element?
4. What is the difference between the child combinator and the descendant combinator?
5. What is the attribute selector? Give some examples.
6. What are two ways that we can make an element invisible? What is the difference?
7. What is the CSS Box Model? Describe each part.
8. What is the usage of `!important`? What are some use cases?
9. What does z-index do?
10. Can padding and margin be negative?
11. How do you center a block element with CSS?
12. What are grid items? Can you explain some grid item properties?
13. What is a flex container? Can you explain some flex container properties?
14. What is responsive web design? How do we achieve this?
</aside>

⼩组间Peer Mock，录⾳并上传

### 2. Quiz

- W3 schools CSS Quiz [https://www.w3schools.com/css/css_quiz.asp](https://www.w3schools.com/css/css_quiz.asp)
- Please attach the screenshot of your results in `note.md`

### 3. Coding

1. Implement the page with 
    1. Flexbox `display:flex`
    2. Grid `display:grid`

![image](https://github.com/user-attachments/assets/b6994427-c9ff-42f0-a429-69df3a7b42e4)


2. Create a Name card. 

- Overall background color is `#f0f2f5` , and font-family is `sans-serif`
- Background color of the name card is white
- Color of the button is `#007bff`
- When hovering on Follow button, the color will darken (choose a color you like). The cursor will be a pointer
- When hovering on the avatar, its size will be a little larger.
- The avatar image can be found here - [https://i.pravatar.cc/80](https://i.pravatar.cc/80)

![image](https://github.com/user-attachments/assets/e1efd7e4-3a95-4e20-ae00-c604715c4427)


- Implement responsive design so that elements switch to a vertical (column) layout.
    - hint - `@media screen and (max-width: 600px)`

![image](https://github.com/user-attachments/assets/f39db683-e85c-4e19-b8fa-db612d105da6)


3. Using **Tailwind CSS**, complete the layout with the following requirements:

- The page should take up the full height of the screen
- The content should be horizontally and vertically centered on the page
- There is one box with blue background color in the center of the page
- The box should have padding on all sides so the text is not touching the edges
- The box should have rounded corners
- The box should display the text “Hello Tailwind”, and text is white
- Starter code

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Tailwind Practice</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  <body>
    <!-- write code here -->
  </body>
</html>
```
<img width="2786" height="1654" alt="image" src="https://github.com/user-attachments/assets/ae5b57ce-404f-4ce1-bcee-e008eea95a02" />
