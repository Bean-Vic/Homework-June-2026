# HW8 Unit Test

## 1. What is Jest?

 Jest is a testing framework for JavaScript and TypeScript. It runs in Node.js. It is used both for unit testing and integration testing.

## 2. What is a test case in Jest?

 A test case is a specific scenario you are validating. For example, it can be a comparison of two values; it can be if a component renders as expected.

 It contains a description of the test, and a callback function containing the testing logic.

## 3. What does `expect` do in Jest?

 `expect` is the function we use inside the callback of a test case to state our expectation of the outcome of the code.

## 4. What is the difference between `.toBe()` and `.toEqual()`?

 Their difference lies in how they compare objects and arrays.

- `.toBe()` checks the memory address of the objects and arrays, while
- `.toEqual()` ignores memory addresses and compares the elements and key-value pairs.

## 5. How do you test if a React component renders correctly?

 We will use React Testing Library, which provides a virtual DOM for Jest, so that we can render any components with props and ues queries to grab it and check if it renders as expected.

## 6. How do you simulate a button click in a test?

 We can use the library of `@testing-library/user-event`. It can setup a user, and fire an operation of clicking.

## 7. How do you mock a function with Jest?

 We'll replace the function with `jest.fn()`, and we can set it to return an arbitrary value. It can also record how many times it was called, if that is what we want to test.

## 8. What is `snapshot test` and how do you utilize it?

 It is a feature of Jest and it is mainly for testing if the HTML of a component, or components, has changed. Its purpose is to flag out the unintentional change to jsx and to HTML, but I actually use it more often to keep a record of how HTML updates over time.
