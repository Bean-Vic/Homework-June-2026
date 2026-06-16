const API = "https://jsonplaceholder.typicode.com";

const usersTable = document.querySelector("#users-table");
const usersMessage = document.querySelector("#users-message");
const userIdInput = document.querySelector("#user-id");
const message = document.querySelector("#message");
const userInfo = document.querySelector("#user-info");
const userPosts = document.querySelector("#user-posts");
const userTodos = document.querySelector("#user-todos");
const delayMessage = document.querySelector("#delay-message");

async function getJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function clearResults() {
  userInfo.innerHTML = "";
  userPosts.innerHTML = "";
  userTodos.innerHTML = "";
}

function valueToText(value) {
  return typeof value === "object" && value !== null ? JSON.stringify(value) : value;
}

function addItem(list, key, value) {
  const item = document.createElement("li");
  item.textContent = `${key}: ${valueToText(value)}`;
  list.appendChild(item);
}

function showObject(list, data) {
  Object.entries(data).forEach(([key, value]) => {
    addItem(list, key, value);
  });
}

function showArray(list, data) {
  data.forEach((object, index) => {
    Object.entries(object).forEach(([key, value]) => {
      addItem(list, `item ${index + 1} ${key}`, value);
    });
  });
}

document.querySelector("#load-users").addEventListener("click", async () => {
  usersMessage.textContent = "Loading users...";
  usersTable.innerHTML = "";

  try {
    const users = await getJSON(`${API}/users`);

    usersTable.innerHTML = users
      .map((user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.address.city}</td>
        </tr>
      `)
      .join("");

    usersMessage.textContent = "";
  } catch (error) {
    usersMessage.textContent = "Could not load users. Please try again.";
    console.error(error);
  }
});

document.querySelector("#search-user").addEventListener("click", async () => {
  const id = userIdInput.value.trim();
  message.textContent = "";
  clearResults();

  if (!id) {
    message.textContent = "Please enter a user ID.";
    return;
  }

  try {
    const [user, posts, todos] = await Promise.all([
      getJSON(`${API}/users/${id}`),
      getJSON(`${API}/posts?userId=${id}`),
      getJSON(`${API}/todos?userId=${id}`),
    ]);

    if (!user.id) {
      throw new Error("User was not found.");
    }

    showObject(userInfo, user);
    showArray(userPosts, posts);
    showArray(userTodos, todos);
  } catch (error) {
    userIdInput.value = "";
    message.textContent = "User was not found. Please try another user ID";
    console.error(error);
  }
});

async function delayedRequest(url = `${API}/users/1`) {
  const data = await getJSON(url);

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  console.log(JSON.stringify(data));
  return data;
}

document.querySelector("#delay-request").addEventListener("click", async () => {
  delayMessage.textContent = "Waiting ...";

  try {
    await delayedRequest();
    delayMessage.textContent = "Check console for the data";
  } catch (error) {
    delayMessage.textContent = "Could not retrieve the data. Please try again.";
    console.error(error);
  }
});
