1. What is Jest?
Jest is a JavaScript testing framework built by Meta. It's the default for React projects — it gives us a test runner, assertion library, and mocking utilities all in one package. We typically use it together with React Testing Library to test components.

2. What is a test case in Jest?
A test case is a single unit of testing, written with test() or it(). It takes a description and a callback containing the assertions — like test('adds two numbers', () => { expect(add(1, 2)).toBe(3) }). Related tests are grouped together inside a describe block.

3. What does `expect` do in Jest?
`expect` wraps a value so we can run assertions on it using matchers. For example, expect(value).toBe(5) or expect(arr).toContain('hello'). If the matcher fails, the test fails with a clear diff showing what was expected versus what we got.

4. What is the difference between `.toBe()` and `.toEqual()`?
`.toBe()` uses Object.is — it checks strict reference equality, so it's good for primitives. `.toEqual()` recursively checks the structure and values, so it's the right one for objects and arrays. Two different object literals with the same content fail `.toBe()` but pass `.toEqual()`.

5. How do you test if a react component renders correctly?
Usually with React Testing Library — we call render(<MyComponent />), then query the output with something like screen.getByText('Hello') and assert it's in the document. The philosophy is to test what the user sees, not implementation details like state or props.

6. How do you simulate a button click in a test?
We use fireEvent.click(button) from React Testing Library, or better, userEvent.click(button) which simulates a more realistic interaction including focus and hover events. We usually grab the button first with screen.getByRole('button', { name: /submit/i }), then click it and assert what changed.

7. How do you mock a function with Jest?
The simplest way is jest.fn(), which creates a mock function we can pass around and inspect — like checking how many times it was called or with what arguments. To mock an entire module, we use jest.mock('./module'). And for return values, we chain .mockReturnValue() or .mockResolvedValue() for promises.

8. What is `snapshot test` and how do you utilize it?
A snapshot test renders a component and saves its output to a file the first time. On subsequent runs, Jest compares the new output against the saved snapshot — if they differ, the test fails. We use expect(tree).toMatchSnapshot(). It's useful for catching unexpected UI changes, though we have to review snapshot updates carefully or they become rubber-stamped.

