# HW4 - Javascript 2

### 0. Leetcode

https://leetcode.com/problem-list/oizxjoit/

每天1-3道题，需要用JavaScript或者TypeScript

### 1. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is the DOM?
2. How can you select an HTML element using JS?
3. What is a DOM event?
4. How do we register event handlers for a selected element?
5. Explain event delegation. Why is it important?
6. What is event propagation? How many phases are there? In what order does it occur?
7. Explain event bubbling and event capturing.
8. What function prevents the bubbling behavior？
9. What is an IIF
10. What is the use of the `preventDefault` method?
11. Can you name some of the new ES6 features?
</aside>

⼩组间Peer Mock，录⾳并上传

### 2. Coding

1. Given the following array and implement the table dynamically. (Basic UI is enough)
    
    ```jsx
    const tableInfo = {
      tableHeader: ["Student Name", "Age", "Phone", "Address"],
      tableContent: [
        {
          "Student Name": "John",
          Age: 19,
          Phone: "455 - 983 - 0903",
          Address: "123 Ave, San Francisco, CA, 94011",
        },
        {
          "Student Name": "Alex",
          Age: 21,
          Phone: "455 - 983 - 0912",
          Address: "456 Rd, San Francisco, CA, 94012",
        },
        {
          "Student Name": "Josh",
          Age: 22,
          Phone: "455 - 345 - 0912",
          Address: "789 Dr, Newark, CA, 94016",
        },
        {
          "Student Name": "Matt",
          Age: 23,
          Phone: "321 - 345 - 0912",
          Address: "223 Dr, Sunnyvale, CA, 94016",
        },
      ],
    };
    ```
    ![image](https://github.com/user-attachments/assets/297091ff-d7ec-4111-85b3-0481554c1498)
    
2. Given the following UI and HTML code, implement the following features, while matching the styling ***as closely*** as possible.
    1. By default, the London tab is selected and only its content is displayed.
    2. When the user clicks on a tab, it is the only one that becomes highlighted, and only the corresponding content will be displayed.
    3. Ex: The user clicks ‘Paris’, so only the ‘Paris’ content is displayed.
    
    *(event delegation is preferred)*  
    
    ![image](https://github.com/user-attachments/assets/288b9510-4195-4bf3-991c-47a36a57f7b0)
    
    ```html
        <div>
          <button>London</button>
          <button>Paris</button>
          <button>Tokyo</button>
        </div>
        <div>
          <h2>London</h2>
          <p>London is the capital city of England</p>
        </div>
        <div>
          <h2>Paris</h2>
          <p>Paris is the capital of France.</p>
        </div>
        <div>
          <h2>Tokyo</h2>
          <p>Tokyo is the capital of Japan.</p>
        </div>
    ```
