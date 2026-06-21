const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const loadUsersButton = document.querySelector("#loadUsersButton");
const usersStatus = document.querySelector("#usersStatus");
const usersTableArea = document.querySelector("#usersTableArea");
const searchForm = document.querySelector("#searchForm");
const userIdInput = document.querySelector("#userIdInput");
const searchStatus = document.querySelector("#searchStatus");
const searchResults = document.querySelector("#searchResults");
const delayedRequestButton = document.querySelector("#delayedRequestButton");
const delayedRequestStatus = document.querySelector("#delayedRequestStatus");

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function createUsersTable(users) {
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Username</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Website</th>
        <th>Company</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.website}</td>
      <td>${user.company.name}</td>
    `;
    tbody.appendChild(row);
  });

  return table;
}

async function loadUsers() {
  setStatus(usersStatus, "Loading users...");
  usersTableArea.innerHTML = "";
  loadUsersButton.disabled = true;

  try {
    const users = await fetchJson(`${API_BASE_URL}/users`);
    usersTableArea.appendChild(createUsersTable(users));
    setStatus(usersStatus, "Users loaded successfully.");
  } catch (error) {
    setStatus(usersStatus, error.message, true);
  } finally {
    loadUsersButton.disabled = false;
  }
}

function formatValue(value) {
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function createKeyValueList(data) {
  const list = document.createElement("ul");
  list.className = "result-list";

  Object.entries(data).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.textContent = `${key}: ${formatValue(value)}`;
    list.appendChild(item);
  });

  return list;
}

function createResultBlock(title, content) {
  const block = document.createElement("article");
  block.className = "result-block";

  const heading = document.createElement("h3");
  heading.textContent = title;
  block.appendChild(heading);

  if (Array.isArray(content)) {
    content.forEach((entry, index) => {
      const subheading = document.createElement("strong");
      subheading.textContent = `${title.slice(0, -1)} ${index + 1}`;
      block.appendChild(subheading);
      block.appendChild(createKeyValueList(entry));
    });
  } else {
    block.appendChild(createKeyValueList(content));
  }

  return block;
}

async function searchUser(userId) {
  setStatus(searchStatus, "Searching...");
  searchResults.innerHTML = "";

  try {
    const [user, posts, todos] = await Promise.all([
      fetchJson(`${API_BASE_URL}/users/${userId}`),
      fetchJson(`${API_BASE_URL}/posts?userId=${userId}`),
      fetchJson(`${API_BASE_URL}/todos?userId=${userId}`),
    ]);

    if (!user || Object.keys(user).length === 0) {
      throw new Error("User was not found. Please try another user ID");
    }

    searchResults.append(
      createResultBlock("User Information", user),
      createResultBlock("Posts", posts),
      createResultBlock("Todos", todos),
    );
    setStatus(searchStatus, `Showing results for user ${userId}.`);
  } catch (error) {
    setStatus(searchStatus, "User was not found. Please try another user ID", true);
    userIdInput.value = "";
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function delayedRequest(url = `${API_BASE_URL}/users/1`) {
  const data = await fetchJson(url);
  await wait(2000);
  console.log(JSON.stringify(data));
}

loadUsersButton.addEventListener("click", loadUsers);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchUser(userIdInput.value.trim());
});

delayedRequestButton.addEventListener("click", async () => {
  setStatus(delayedRequestStatus, "Waiting ...");
  delayedRequestButton.disabled = true;

  try {
    await delayedRequest();
    setStatus(delayedRequestStatus, "Check console for the data");
  } catch (error) {
    setStatus(delayedRequestStatus, error.message, true);
  } finally {
    delayedRequestButton.disabled = false;
  }
});
