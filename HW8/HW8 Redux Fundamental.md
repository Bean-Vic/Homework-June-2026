# HW8: Redux Fundamental

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is the Flux architecture?
2. Explain what the Redux store, actions, reducers are and what they do.
3. Describe the work flow of Redux
4. How do you create/configure a store in redux?
5. Explain how to use `connect()` 
6. What is `mapDispatchToProps` and what does it do?
7. What is `mapStateToProps` and what does it do?
8. how do we use `useSelector` and `useDispatch`?
</aside>

⼩组间Peer Mock，录⾳并上传

### 2. Coding

Write a `functional component`: (revision of number counter from React fundamental)

1. Install dependencies: `reduxjs/toolkit`, `redux`, `react-redux`
2. Initial value should be initialized by redux store (reducer)
3. write actions and creators for updating (increment/decrement) values in store
4. use either `useSelector` or `mapStateToProps`to render state value on web page
5. build 2 buttons to dispatch increment and decrement events by using `mapDispatchToProps` 
6. build ANOTHER 2 buttons to dispatch actions by using `useDispatch` 
7. Extra Credit:  `read` the **initial value** from `localStorage` as cached value at ***mounting phase(not at initial value of store)*** and ******`write` the current value back to `localStorage` when component ***unmounting***. So next time when you open the same application, value will be initialized as last change.
8. Bonus: Make you App look pretty by using 3rd party CSS components like MUI/tailwindCSS (you can reuse the style from previous coding challenge)