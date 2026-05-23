# HW9: Redux Middleware

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is Redux Middleware?
2. Describe the timing of redux middleware functions executed in middle of FLUX flow
3. how to apply middleware to redux store?
4. What is redux-saga?
5. What is generator function and how to use it?
6. what’s the advantage and disadvantage of using redux-saga compared with redux-thunk?
7. how to create and run a saga middleware?
8. compare with `takeLatest` vs `takeEvery` 
9. compare `fork` vs `spawn` 
10. how to call a function in a saga middleware function?
11. how to acquire redux store value in a saga middle function?
</aside>

⼩组间Peer Mock，录⾳并上传

### 2. Coding

Write a `functional component` with React hooks: (Similar with Dog Image Fetcher)

1. Install dependencies: `redux-saga` , Optional: `redux-saga-test-plan`
2. Fetches a **random dog image** from a public API when component mounting by using `Axios`, the API request should happen in saga middleware and data should be stored in redux store
3. Render the dog image base on API response using selector
4. Build a **"Get Another Dog"** button to fetch a new image by dispatching an action
5. have a **loading** state while API is loading, loading status should be maintained at redux store
6. should properly handle failure API requests, error status should be maintained at redux store
7. Extra Credit: write up unit test using `redux-saga-test-plan` with `testSaga()` function
8. Bonus: Make you App look pretty by using 3rd party CSS components like MUI/tailwindCSS (you can reuse the style from previous homework)

Note: use following API with GET method [`https://dog.ceo/api/breeds/image/random](https://dog.ceo/api/breeds/image/random)` ([https://dog.ceo/dog-api/](https://dog.ceo/dog-api/))

Sample payload:

```jsx
{

	"message": "https://images.dog.ceo/breeds/terrier-norfolk/n02094114_3240.jpg",
	
	"status": "success"

}
```