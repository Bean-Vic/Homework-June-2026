# HW6: React Fundamentals

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is a SPA?
2. What is JSX?
3. What is Virtual DOM?
4. What does `ReactDOM.render()` do?
5. What are props?
6. How do prop updates affect rendering?
7. What is a state, and how do you update it? Can you mutate it directly?
8. What is the difference between a `controlled` component and `uncontrolled` component?
9. Explain the React component lifecycle.
10. List some lifecycle methods and explain what do they do
11. What is the execution order of constructor, render, and lifecycle methods?
12. Describe the use case of lifecycle methods.
13. What is React strict mode?
14. What are synthetic events and how are they different than DOM events?
15. List some common events that you used most
16. How do React handle errors?
</aside>

⼩组间Peer Mock，录⾳并上传

### 2. Coding

1. Write a `class component`:
    1. Passing in the initial value as props
    2. the component should manage it’s own state.
    3. render current state on web page
    4. build 2 buttons to increase and decrease shown value on previous point
    5. Extra Credit: Write an HOC which will wrap the class component and will `read/write/update` the **initial value** from `localStorage` as cached value. So next time when you open the same application, value will be initialized as last change.
    6. Bonus: Make you App look pretty by using 3rd party CSS components like MUI/tailwindCSS
2. Mini shopping cart
    1. user will be able to choose an item from a `dropdown` component to select the item 
    2. there will be another `input` element allow user to enter quantity of item they select
    3. create a button to allow user add selected item with desired quantity to cart
    4. create a `table` to render purchase summary (item, price, quantity and total)
    5. Extra Credit: allow user delete item from cart
    
    > sample design: (for reference only, don’t necessarily need to be pixel perfect)
    > 
    
   ![image](https://github.com/user-attachments/assets/7dd7158e-b28d-4897-aed5-28120a12d30d)
