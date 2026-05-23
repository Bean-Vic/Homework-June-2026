# Optional Exercise: React-Router

### 0. 问答练习(八股）

准备以下⼋股题⽬答案, 写在`note.md`⾥

<aside>

1. What is the difference between a `<Link>` and an `<a>` tag?
2. What is `<Route>` used for?
3. What is the difference between `path="/"` and `path="*"`?
4. How do you navigate using react-router?
5. How do you redirect a user in React Router?
6. How to acquire the user's current URL params?
</aside>

⼩组间Peer Mock，录⾳并上传

### 1. Coding

Build a **mini React website** with **navigation and dynamic routing** using **React Router v6:**

1. Setup React Router in the app
2. Create 3 pages:
    1. Home (`/`)
    2. About (`/about`)
    3. User Profile (`/user/:username`) → dynamic route
3. Create a **navigation bar** with `<Link>` to Home and About.
4. Add a **404 "Not Found" page** for all other routes.
5. On the User Profile page, read the ***username*** from the URL and display it.
6. Bonus: Add a **button** on Home page to programmatically navigate to `/user/someone`.

Details:

| Page | Path | What to show |
| --- | --- | --- |
| Home | `/` | "Welcome to the Home Page" 
Bonus: button to `/user/guest` |
| About | `/about` | "About Us Page” |
| User Profile | `/user/:username` | "Hello, {username}” |
| Not Found (404) | `*` | "404 Page Not Found” |