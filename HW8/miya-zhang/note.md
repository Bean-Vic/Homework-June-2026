## 1. What is Jest?

It’s basically the go-to testing framework for JavaScript and React projects. I like it because it's essentially "zero-config" out of the box—it comes with its own test runner, assertion library, and built-in mocking tools all in one package.

## 2. What is a test case in Jest?

A test case is just a single block of code that tests one specific piece of behavior in your app. We write them using the test() or it() function, where we describe what should happen, and then write the logic to verify it.

## 3. What does expect do in Jest?

expect is what we use to make assertions. You wrap the actual value you are testing inside expect(), and then chain a "matcher" (like .toBe or .toEqual) to it to check if it matches your expected outcome.

## 4. What is the difference between .toBe() and .toEqual()?

This is a classic one. .toBe() uses strict equality (like === in memory), so it’s perfect for primitive types like strings or numbers. On the other hand, .toEqual() does a deep comparison, so you must use it when you want to compare the actual contents of objects or arrays.

## 5. How do you test if a React component renders correctly?

I typically use React Testing Library. I'll import the render function, pass my component into it, and then use screen queries—like screen.getByText() or screen.getByRole()—to assert that specific elements actually exist in the document.

## 6. How do you simulate a button click in a test?

First, I grab the button element from the rendered DOM, usually with screen.getByRole('button'). Then, I use userEvent.click(button) (or sometimes fireEvent.click()) to simulate the user interaction. After that, I just assert whatever state change or API call was supposed to happen.

## 7. How do you mock a function with Jest?

I just use jest.fn(). It creates a dummy function that lets me track if it was called, how many times it was called, and what arguments were passed to it. If I need it to return fake data for the test, I'll just chain .mockReturnValue() to it.

## 8. What is snapshot test and how do you utilize it?

A snapshot test basically takes a "picture" of your component's rendered HTML structure and saves it to a file. Next time you run the test, Jest compares the new render to that saved snapshot. I mainly utilize it to catch accidental UI or structural regressions in components that aren't supposed to change frequently.
