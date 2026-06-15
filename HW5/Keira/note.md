# HW5 - JavaScript 3 Notes

## 1. What are the differences between `call`, `apply`, and `bind`?

All three are Function methods used to control the value of `this`.

| Method | Runs function immediately? | How arguments are passed | Return value |
|---|---:|---|---|
| `call()` | Yes | One by one | Function result |
| `apply()` | Yes | As an array | Function result |
| `bind()` | No | One by one | A new function |

```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "Keira" };

greet.call(person, "Hello", "!");
greet.apply(person, ["Hi", "!"]);

const boundGreet = greet.bind(person, "Hey", "!");
boundGreet();
```

### Key idea
- `call` = call now, arguments separately.
- `apply` = apply now, arguments as array.
- `bind` = create a new function with fixed `this`.

---

## 2. Explain the `this` keyword in JavaScript.

`this` refers to the object that is currently calling the function.

```js
const user = {
  name: "Keira",
  sayName() {
    console.log(this.name);
  }
};

user.sayName(); // Keira
```

In JavaScript, `this` depends on how the function is called, not where it is written.

### Common rules

```js
console.log(this); 
```

In the browser global scope, `this` usually refers to `window`.

```js
function showThis() {
  console.log(this);
}

showThis();
```

In non-strict mode, this may refer to the global object. In strict mode, it is `undefined`.

```js
const obj = {
  value: 10,
  show() {
    console.log(this.value);
  }
};

obj.show(); // 10
```

When a method is called from an object, `this` is that object.

```js
const arrowObj = {
  value: 20,
  show: () => {
    console.log(this.value);
  }
};

arrowObj.show();
```

Arrow functions do not have their own `this`. They use `this` from their surrounding scope.

---

## 3. What does the event loop do? What data structures does it use?

The event loop lets JavaScript handle asynchronous operations even though JavaScript runs on a single main thread.

JavaScript uses:

1. **Call Stack**
   - Stores currently running function calls.
   - Last In, First Out.

2. **Web APIs / Browser APIs**
   - Handle timers, DOM events, network requests, etc.

3. **Task Queue / Macrotask Queue**
   - Stores callbacks from `setTimeout`, `setInterval`, DOM events, etc.
   - First In, First Out.

4. **Microtask Queue**
   - Stores Promise callbacks such as `.then()`, `.catch()`, `.finally()`, and `queueMicrotask`.
   - Runs before the macrotask queue.

### Event loop rule

The event loop checks:

1. Is the call stack empty?
2. If yes, run all microtasks.
3. Then run one macrotask.
4. Repeat.

Example:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

Output:

```txt
A
D
C
B
```

Why?

- `A` runs first.
- `setTimeout` callback goes to macrotask queue.
- Promise callback goes to microtask queue.
- `D` runs.
- Microtask runs: `C`.
- Macrotask runs: `B`.

---

## 4. What are closures?

A closure happens when an inner function remembers variables from its outer function, even after the outer function has finished running.

```js
function outer() {
  let count = 0;

  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();

counter(); // 1
counter(); // 2
counter(); // 3
```

The inner function keeps access to `count`.

### Why closures are useful

Closures are useful for:

- Data privacy
- Function factories
- Callbacks
- Event handlers
- Maintaining state without using global variables

---

## 5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?

Asynchronous code allows long-running tasks to run without blocking the rest of the program.

Example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer done");
}, 1000);

console.log("End");
```

Output:

```txt
Start
End
Timer done
```

JavaScript achieves asynchronous behavior using:

- Browser APIs / Node.js APIs
- Callback functions
- Promises
- `async` / `await`
- Event loop
- Task queue
- Microtask queue

JavaScript itself is single-threaded, but the environment around it can handle async work.

---

## 6. What are `async` and `await`? How do we use them?

`async` and `await` are syntax for working with Promises in a cleaner way.

An `async` function always returns a Promise.

```js
async function getData() {
  return "Hello";
}

getData().then(result => console.log(result));
```

`await` pauses the async function until the Promise finishes.

```js
async function fetchUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await response.json();
  console.log(data);
}

fetchUser();
```

### Error handling

```js
async function fetchUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Something went wrong:", error);
  }
}
```

---

## 7. How many HTTP methods are there? Explain each one.

Common HTTP methods include:

| Method | Purpose |
|---|---|
| `GET` | Read or request data |
| `POST` | Create new data |
| `PUT` | Replace an entire resource |
| `PATCH` | Update part of a resource |
| `DELETE` | Delete a resource |
| `HEAD` | Like GET, but only gets headers |
| `OPTIONS` | Shows what methods/options are supported |
| `CONNECT` | Creates a tunnel, often used for HTTPS proxies |
| `TRACE` | Diagnostic method that echoes the request |

### Difference between `POST` and `PUT`

| Feature | POST | PUT |
|---|---|---|
| Main use | Create a new resource | Replace/update a specific resource |
| URL | Often collection URL | Usually specific resource URL |
| Idempotent? | No | Yes |

### Idempotent meaning

An operation is idempotent if doing it multiple times has the same result as doing it once.

Example:

```txt
POST /users
```

May create a new user every time.

```txt
PUT /users/123
```

Updates/replaces user 123. Repeating it should produce the same final result.

---

## 8. What is a Promise?

A Promise is an object that represents a future result of an asynchronous operation.

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Data loaded");
  } else {
    reject("Error happened");
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.log(error));
```

A Promise is useful because async code may not finish immediately.

---

## 9. What is promise chaining?

Promise chaining means connecting multiple `.then()` calls together.

Each `.then()` can return a value or another Promise.

```js
Promise.resolve(2)
  .then(num => num * 2)
  .then(num => num + 1)
  .then(result => {
    console.log(result);
  });
```

Output:

```txt
5
```

Promise chaining helps avoid deeply nested callbacks.

---

## 10. Explain the three states of a Promise.

A Promise has three states:

| State | Meaning |
|---|---|
| `pending` | Initial state. Not fulfilled or rejected yet. |
| `fulfilled` | Operation completed successfully. |
| `rejected` | Operation failed. |

Example:

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Done");
  }, 1000);
});
```

At first it is `pending`. After one second, it becomes `fulfilled`.

Once a Promise becomes fulfilled or rejected, its state cannot change again.

---

## 11. What is the use of `Promise.all()`? How is it different from `Promise.allSettled()`?

`Promise.all()` runs multiple Promises at the same time and waits until all of them succeed.

```js
const p1 = Promise.resolve("A");
const p2 = Promise.resolve("B");

Promise.all([p1, p2]).then(results => {
  console.log(results);
});
```

Output:

```txt
["A", "B"]
```

If one Promise rejects, `Promise.all()` rejects immediately.

```js
const p1 = Promise.resolve("A");
const p2 = Promise.reject("Error");

Promise.all([p1, p2])
  .then(results => console.log(results))
  .catch(error => console.log(error));
```

Output:

```txt
Error
```

`Promise.allSettled()` waits for every Promise to finish, whether they succeed or fail.

```js
const p1 = Promise.resolve("A");
const p2 = Promise.reject("Error");

Promise.allSettled([p1, p2]).then(results => {
  console.log(results);
});
```

Output:

```js
[
  { status: "fulfilled", value: "A" },
  { status: "rejected", reason: "Error" }
]
```

### Main difference

| Method | If one Promise fails | Return result |
|---|---|---|
| `Promise.all()` | Rejects immediately | Array of fulfilled values |
| `Promise.allSettled()` | Still waits for all | Array of status objects |

---

## 12. What is a callback function?

A callback function is a function passed into another function as an argument and called later.

```js
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayBye() {
  console.log("Bye");
}

greet("Keira", sayBye);
```

Output:

```txt
Hello Keira
Bye
```

Callbacks are often used in:

- Event handlers
- Timers
- Array methods
- Async code

Example with `setTimeout`:

```js
setTimeout(() => {
  console.log("This runs later");
}, 1000);
```

The arrow function is a callback.

---

## 13. Difference between 401 and 403 error code.

| Code | Meaning | Example |
|---|---|---|
| `401 Unauthorized` | You are not authenticated. Need to log in or provide valid credentials. | Missing or invalid token |
| `403 Forbidden` | You are authenticated, but you do not have permission. | Logged in, but not admin |

### Simple distinction

- `401` = Who are you? Please log in.
- `403` = I know who you are, but you are not allowed.

---

## 14. What does `response.json()` do when fetching an API?

`response.json()` reads the response body and parses it as JSON.

Important: `response.json()` returns a Promise.

```js
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => response.json())
  .then(data => console.log(data));
```

Using `async` / `await`:

```js
async function getUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await response.json();
  console.log(data);
}
```

It does not directly return the data immediately. You need `.then()` or `await`.

---

## 15. Describe the difference between a cookie, `sessionStorage`, and `localStorage` in browsers.

| Feature | Cookie | sessionStorage | localStorage |
|---|---|---|---|
| Storage size | Small, about 4KB | Larger, around 5MB | Larger, around 5MB |
| Sent to server automatically? | Yes, with matching requests | No | No |
| Expiration | Can be set manually | Cleared when tab/session closes | Persists until manually cleared |
| Scope | Domain/path based | Same tab + same origin | Same origin |
| Common use | Auth, tracking, server communication | Temporary page/session data | Persistent client-side data |

### Examples

```js
// localStorage
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme"));

// sessionStorage
sessionStorage.setItem("step", "2");
console.log(sessionStorage.getItem("step"));

// cookie
document.cookie = "username=Keira; max-age=3600";
```

---

## 16. Explain the Event Loop in JavaScript.

The event loop coordinates the call stack, microtask queue, and macrotask queue.

JavaScript runs synchronous code first on the call stack.

Async callbacks wait in queues until the stack is empty.

Promise callbacks go to the microtask queue.

Timer callbacks go to the macrotask queue.

Microtasks run before macrotasks.

Example:

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

Output:

```txt
1
4
3
2
```

Reason:

1. `console.log("1")` runs.
2. `setTimeout` callback goes to macrotask queue.
3. Promise `.then()` callback goes to microtask queue.
4. `console.log("4")` runs.
5. Microtask queue runs: `3`.
6. Macrotask queue runs: `2`.

---

## 17. What is the output of the following code?

```js
(function (a) {
  return (function () {
    console.log(a);
    a = 23;
  })();
})(45);
```

Output:

```txt
45
```

### Explanation

The outer IIFE receives `45` as argument `a`.

Inside the outer function, another IIFE runs immediately.

The inner function has access to `a` because of closure.

At the moment `console.log(a)` runs, `a` is still `45`.

After logging, `a = 23` changes the value, but nothing logs after that.

So the output is:

```txt
45
```

---

# Short Interview Script

Use this if you need to answer quickly in an interview.

## call, apply, bind

`call`, `apply`, and `bind` are used to control the value of `this`. `call` runs the function immediately and passes arguments one by one. `apply` also runs the function immediately but passes arguments as an array. `bind` does not run immediately. It returns a new function with `this` fixed.

## this

`this` refers to the object that is calling the function. Its value depends on how the function is called. In an object method, `this` usually refers to the object. In a regular function, it can be the global object or `undefined` in strict mode. Arrow functions do not have their own `this`; they inherit it from the surrounding scope.

## Event loop

The event loop allows JavaScript to handle asynchronous code while still being single-threaded. JavaScript runs synchronous code on the call stack first. Async callbacks wait in queues. Promise callbacks go to the microtask queue, and timers/events go to the macrotask queue. When the call stack is empty, the event loop runs microtasks first, then macrotasks.

## Closures

A closure is when an inner function remembers variables from its outer function even after the outer function has finished running. Closures are useful for keeping private state, creating function factories, and writing callbacks.

## Async code

Asynchronous code is code that does not block the program while waiting for something slow, such as a timer, network request, or file operation. JavaScript achieves this using Web APIs or Node APIs, callbacks, Promises, async/await, and the event loop.

## async and await

`async` and `await` are cleaner syntax for working with Promises. An `async` function always returns a Promise. `await` pauses the async function until the Promise resolves or rejects. We usually use `try/catch` to handle errors.

## HTTP methods

Common HTTP methods include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`, `CONNECT`, and `TRACE`. `GET` reads data. `POST` creates data. `PUT` replaces an entire resource. `PATCH` partially updates a resource. `DELETE` removes a resource.

## POST vs PUT

`POST` is usually used to create a new resource, often at a collection URL like `/users`. It is not idempotent. `PUT` is usually used to replace or update a specific resource like `/users/123`. It is idempotent.

## Promise

A Promise is an object representing the future result of an asynchronous operation. It can be pending, fulfilled, or rejected.

## Promise chaining

Promise chaining means connecting multiple `.then()` calls. Each `.then()` receives the result from the previous one and can return a new value or another Promise.

## Promise states

A Promise has three states: pending, fulfilled, and rejected. Pending means the operation has not finished. Fulfilled means it succeeded. Rejected means it failed. Once settled, the Promise state cannot change.

## Promise.all vs Promise.allSettled

`Promise.all()` waits for all Promises to fulfill, but rejects immediately if one fails. `Promise.allSettled()` waits for every Promise to finish and returns the status of each one, whether fulfilled or rejected.

## Callback

A callback is a function passed into another function as an argument and called later. It is commonly used in event handlers, timers, array methods, and async code.

## 401 vs 403

`401` means unauthenticated. The user needs to log in or provide valid credentials. `403` means authenticated but not authorized. The server knows who the user is, but the user does not have permission.

## response.json()

`response.json()` reads the response body from `fetch` and parses it as JSON. It returns a Promise, so we need to use `.then()` or `await`.

## Cookie vs sessionStorage vs localStorage

Cookies are small and can be sent to the server automatically. `sessionStorage` stores data for one browser tab session and clears when the tab closes. `localStorage` stores data persistently until manually cleared. `sessionStorage` and `localStorage` are not automatically sent to the server.

## Code output

The output is `45`. The inner function remembers the outer function parameter `a` through closure. It logs `45` first, then changes `a` to `23`, but there is no second log.
