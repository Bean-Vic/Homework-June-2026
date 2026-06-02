# HW5 - Javascript 3

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What are the diﬀerences between call, apply & bind?
2. Explain the this keyword in JavaScript.
3. Explain the Event Loop in JavaScript.
4. What are closures?
5. What is asynchronous code in JavaScript? How does JavaScript achieve asynchronous code?
6. What is async & await? How do we use them?
7. How many HTTP methods are there? Explain each one.
    a. What is the diﬀerence between POST and PUT?
8. What is a Promise?
9. What is promise chaining?
10. Explain the three states of a Promise.
11. What is the use of Promise.all? How is it different from Promise.allSettled?
12. What is a callback function?
13. Difference between 401 and 403 error code.
14. What does `response.json()` do when fetching an API?
15. Describe the difference between a cookie, sessionStorage and localStorage in browsers.
16. What is the output of the following code?
    ```
    (function (a) {
      return (function () {
        console.log(a);
        a = 23;
      })();
    })(45);
    ```

⼩组间Peer Mock，录⾳并上传

### 2. Coding
1. Use HTML/CSS/JS to solve the following problems. Please follow best practices when you write the code so that it would be easily readable, maintainable, and eﬃcient.
    1. [Part 1] Given a url **`https://jsonplaceholder.typicode.com/users`**, send a GET request to display the data on the page in a **table**. Errors should be handled properly.
    2. [Part 2] Create a text input box and a search button. When you input a user ID and click search, it should display that user’s information, posts, and todos all in the same page in a **list** with the format of  key: value. *(Hint: Promise.all() or Promise.allSettled())*
        - For example, when the user types 2, display the data from the following urls:
            
            https://jsonplaceholder.typicode.com/users/2
            
            https://jsonplaceholder.typicode.com/posts?userId=2
            
            https://jsonplaceholder.typicode.com/todos?userId=2
            
        - If the user ID is invalid (no data in the response), there should be an error message says `User was not found. Please try another user ID` and then clear the input box.
    3. [Part 3] Implement a function **delayedRequest(url)** that fetches data from the url and outputs the json string data to the **console** after 2 seconds. *(Hint: JSON.stringify)*
        - After clicking the button, immediately display `Waiting …` on the page.
        - After the data is retrieved, replace the message with `Check console for the data` in the same area.
        - Test it with any of the “https://jsonplaceholder.typicode.com/users/${id}" urls. You may set a default value for the function parameter.
    
    Put the three parts on a single page, similar to the example below:
    
    Sample web page
   ![image](https://github.com/user-attachments/assets/124237ac-0247-4c2d-9edb-83743a274fc4)
