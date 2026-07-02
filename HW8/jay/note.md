


<aside>

1. What is Jest?

Jest is a JavaScript testing framework commonly used to test JavaScript and TypeScript applications. It is especially popular in React projects because it works well with React Testing Library and provides tools for writing unit tests, integration tests, mocks, assertions, and snapshot tests. Jest is useful because it comes with many features built in, such as a test runner, assertion library, mocking system, and code coverage reports.

2. What is a test case in Jest?

A test case in Jest is a small block of code that checks whether a specific part of the application behaves correctly. It is usually written using the test() or it() function. A test case typically sets up some input, runs the function or component being tested, and then checks the result using an assertion.

3. What does `expect` do in Jest?

expect is used to make assertions in Jest. It takes the actual value produced by the code and compares it against the expected value. For example, expect(result).toBe(5) checks that result is exactly 5.

4. What is the difference between `.toBe()` and `.toEqual()`?

.toBe() checks for strict equality, which means it is best used for primitive values like numbers, strings, booleans, or checking if two variables reference the exact same object. .toEqual() checks whether two objects or arrays have the same contents. For example, expect(5).toBe(5) is appropriate for numbers, while expect([1, 2]).toEqual([1, 2]) is better for arrays because two separate arrays with the same values are not the same reference in memory.

5. How do you test if a react component renders correctly?

To test if a React component renders correctly, you usually render the component using React Testing Library and then check whether expected elements appear on the screen. For example, you can use render(<MyComponent />) and then use queries like screen.getByText() or screen.getByRole() to find elements. If the expected text, button, heading, or input is present, then the component is rendering correctly.

6. How do you simulate a button click in a test?

To simulate a button click in a React test, you first render the component, find the button, and then trigger a click event. With React Testing Library, this is often done using userEvent.click(button). After clicking the button, you can use expect to check whether the correct result happened, such as text changing or a mock function being called.

7. How do you mock a function with Jest?

You can mock a function in Jest using jest.fn(). A mock function lets you track whether the function was called, how many times it was called, and what arguments were passed to it. For example, const mockFunction = jest.fn() creates a fake function. You can then pass it into a component or call it directly, and later check it with expect(mockFunction).toHaveBeenCalled() or expect(mockFunction).toHaveBeenCalledWith(value).

8. What is `snapshot test` and how do you utilize it?

A snapshot test is a type of test that saves the rendered output of a component and compares future test runs against that saved version. It is useful for detecting unexpected UI changes. In Jest, snapshot testing is commonly done by rendering a component and calling expect(component).toMatchSnapshot(). The first time the test runs, Jest creates a snapshot file. Later, if the component output changes, Jest will fail the test and ask whether the snapshot should be updated.

</aside>

