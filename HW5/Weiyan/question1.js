// Part 1
const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const load_users_btn = document.getElementById('load-users-btn');

load_users_btn.addEventListener('click', () => {
    fetchAndDisplayUsers();
});

async function fetchAndDisplayUsers() {
    const table = document.getElementById('users-table');
    const tbody = document.getElementById('users-tbody');

    try {
        const response = await fetch(usersUrl);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();
        tbody.replaceChildren();
        const fragment = document.createDocumentFragment();

        users.forEach(user => {
            const row = document.createElement('tr');

            // User ID
            const cellId = document.createElement('td');
            cellId.textContent = user.id;

            // Name
            const cellName = document.createElement('td');
            cellName.textContent = user.name;

            // Username
            const cellUsername = document.createElement('td');
            cellUsername.textContent = user.username;

            // Email
            const cellEmail = document.createElement('td');
            const emailLink = document.createElement('a');
            emailLink.href = `mailto:${user.email}`;
            emailLink.textContent = user.email;
            cellEmail.appendChild(emailLink);
            
            // Address
            const cellCity = document.createElement('td');
            const addr = user.address; 
            cellCity.textContent = `${user.address.city}`;

            row.append(cellId, cellName, cellUsername, cellEmail, cellCity);
            fragment.appendChild(row);
        });

        tbody.appendChild(fragment);

    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
}

// Part 2
const searchBtn = document.getElementById('search-btn');
const userIdInput = document.getElementById('user-id-input');
const part2Error = document.getElementById('part2-error');

const userInfoList = document.getElementById('user-info-list');
const userPostsList = document.getElementById('user-posts-list');
const userTodosList = document.getElementById('user-todos-list');

searchBtn.addEventListener('click', async () => {
    userInfoList.replaceChildren();
    userPostsList.replaceChildren();
    userTodosList.replaceChildren();
    const userId = userIdInput.value.trim();
    if (!userId) return;

    try {
        const infoUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
        const postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
        const todosUrl = `https://jsonplaceholder.typicode.com/todos?userId=${userId}`;

        const [userRes, postsRes, todosRes] = await Promise.all([
            fetch(infoUrl),
            fetch(postsUrl),
            fetch(todosUrl)
        ]);

        if (!userRes.ok) {
            userIdInput.value = '';
            throw new Error('User was not found. Please try another user ID');
        }

        const user = await userRes.json();
        const posts = await postsRes.json();
        const todos = await todosRes.json();

        // User Info
        const infoKeys = ['name', 'username', 'email', 'phone'];
        infoKeys.forEach(key => {
            if (user[key]) {
                const li = document.createElement('li');
                li.innerHTML = `<span class="key-label">${key}:</span> ${user[key]}`;
                userInfoList.appendChild(li);
            }
        });

        // User Posts
        posts.forEach(post => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="key-label">${post.id}</span>: ${post.title}`;
            userPostsList.appendChild(li);
        });

        // User Todos
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="key-label">${todo.id}</span>: ${todo.title}`;
            userTodosList.appendChild(li);
        });

    } catch (error) {
        part2Error.textContent = error.message;
        userIdInput.value = '';
    }
});

// Part 3
const delayedBtn = document.getElementById('delayed-btn');
const part3Status = document.getElementById('part3-status');

async function delayedRequest(url = 'https://jsonplaceholder.typicode.com/users/1') {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                console.log(JSON.stringify(data, null, 2));
                resolve();
            } catch (error) {
                console.error("Delayed request failed:", error);
                reject(error);
            }
        }, 2000); 
    });
}

delayedBtn.addEventListener('click', async () => {

    delayedBtn.disabled = true;
    part3Status.textContent = 'Waiting ...';

    try {
        await delayedRequest();
        part3Status.textContent = 'Check console for the data';
    } catch (error) {
        part3Status.textContent = 'Request failed. Check console.';
    } finally {
        delayedBtn.disabled = false;
    }
});