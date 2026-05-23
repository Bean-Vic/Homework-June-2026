# HW7: React Hooks

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. How do we do prop types check?
2. What is Prop drilling?
3. How are we going to render a variable as a react component?
4. What is ***HOC*** and why we need it?
5. How to properly render an SVG element as a react component?
6. What is lazy loading and what does it help?
7. List several react hooks that you use most and what do they do?
8. what is `useState` and what value we should pass in as prop?
9. what is the hook `useEffect` and why we need it?
10. What is dependency array in `useEffect`?
11. What is the lifecycle method `componentDidUpdate` equivalent hook?
12. What is the lifecycle method `componentDidMount` equivalent hook?
13. What is the lifecycle method `componentWillUnmount` equivalent hook?
14. What’s the difference between `useCallback` and `useMemo`?
15. What is `useContext` and the difference between `useContext` and `useState`?
</aside>

⼩组间Peer Mock，录⾳并上传

### 2. Coding

Write a `functional component` with React hooks:

1. Fetches a **random dog image** from a public API
2. Render the dog image base on API response
3. Build a **"Get Another Dog"** button to fetch a new image
4. have a **loading** state while API is loading
5. use `fetch()` method to make API request
6. should properly handle failure API requests
7. Extra Credit: Instead of using `fetch()` , use `Axios` with `Factory` design pattern to make the API request
8. Bonus: Make you App look pretty by using 3rd party CSS components like MUI/tailwindCSS

Note: use following API with GET method [`https://dog.ceo/api/breeds/image/random](https://dog.ceo/api/breeds/image/random)` ([https://dog.ceo/dog-api/](https://dog.ceo/dog-api/))

Sample payload:

```jsx
{

	"message": "https://images.dog.ceo/breeds/terrier-norfolk/n02094114_3240.jpg",
	"status": "success"

}
```

### 3. Coding — Todo List

Build a **functional component** with React hooks:

1. Render a **Todo List** page.
2. The page should contain a **text input** and an **Add** button:
    - When the input is not empty, clicking **Add** should create a new todo at the top of the list.
    - Pressing Enter should also submit.
    - After submission, clear the input.
3. Each todo item should display:
    - The text content
    - An **Edit** button (switch to editable state, save with Enter, cancel with Esc)
    - A **Delete** button (remove the todo; optional: confirm before delete)
4. Support **toggle completed state** (checkbox or button). Completed items should have different styling (e.g., strikethrough or opacity).
5. Use a **stable key** when rendering list items (e.g., `id` instead of array index).
6. Implement **input validation and error handling**:
    - Prevent adding empty/whitespace-only todos.
    - Apply the same validation when editing.
    - Show user-friendly feedback for errors (e.g., toast, text message).
7. Use **clear state management** (e.g., `todos`, `inputValue`, `editingId`).
8. Optional: Add **filters and counts**
    - Filters: All / Active / Completed
    - Show remaining count (e.g., “2 items left”).

### Extra Credit

1. Create a **custom hook** (e.g., `useTodos()`) to encapsulate add/edit/delete logic.
2. Use **useReducer** to manage todos with actions (`ADD`, `DELETE`, `TOGGLE`, `EDIT`).
3. Add **unit tests** for core functions (Jest/RTL).
4. Improve **accessibility**: add `aria-label`s for buttons/inputs and support keyboard navigation.

### Bonus (Styling & Persistence)

1. Use **MUI** or **TailwindCSS** to style the app.
2. Add **localStorage persistence**:
    - Load todos from `localStorage` on app start.
    - Save todos back to `localStorage` whenever they change.
    - Suggested key: `"todo-list"`.

---

### Suggested Data Structure

```json
{
  "id": "uuid-or-ulid",
  "text": "Buy milk",
  "completed": false,
  "updatedAt": 1736033112000
}

```

### Acceptance Criteria

- [ ]  Can add a new todo when input is not empty. Input clears after add.
- [ ]  Can delete, edit, and toggle completed state. Edit supports Enter (save) and Esc (cancel).
- [ ]  Todos persist after page reload (if Bonus is implemented).
- [ ]  List rendering uses stable keys, no console warnings.
- [ ]  User feedback provided (disabled buttons, error messages, etc).
- [ ]  Code is well-structured: components, hooks, or reducer (if Extra Credit is attempted).

### Tips

- Use `crypto.randomUUID()` or libraries like `ulid` for IDs.
- Consider a `useLocalStorage(key, initialValue)` hook for persistence.
- For edit mode: controlled input + `editingId` or inline form.
- Filters can be managed with state for advanced cases.

Basic mode:

<img width="512" height="512" alt="basic mode" src="https://github.com/user-attachments/assets/9c94adff-c300-432c-98e7-7796d525ea04" />



Edit mode:

<img width="512" height="512" alt="edit mode" src="https://github.com/user-attachments/assets/dae3b094-81a5-4a27-b7d9-2e269b981d1e" />
