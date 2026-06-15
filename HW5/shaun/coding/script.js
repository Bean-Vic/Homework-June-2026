const BASE_URL = "https://jsonplaceholder.typicode.com";

async function fetchJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
const loadUsersButton =
  document.getElementById("load-users-button");

const usersBody =
  document.getElementById("users-body");

const usersMessage =
  document.getElementById("users-message");

loadUsersButton.addEventListener("click", displayAllUsers);

async function displayAllUsers() {
  usersBody.replaceChildren();
  usersMessage.textContent = "Loading...";

  try {
    const users = await fetchJSON(`${BASE_URL}/users`);

    users.forEach((user) => {
      const row = document.createElement("tr");

      const values = [
        user.id,
        user.name,
        user.email,
        user.address.city,
      ];

      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      usersBody.appendChild(row);
    });

    usersMessage.textContent = "";
  } catch (error) {
    usersMessage.textContent = "Unable to load users.";
    usersMessage.classList.add("error");
    console.error(error);
  }
}
function createDataList(data) {
  const list = document.createElement("ul");

  Object.entries(data).forEach(([key, value]) => {
    const item = document.createElement("li");

    if (typeof value === "object" && value !== null) {
      item.textContent = `${key}: ${JSON.stringify(value)}`;
    } else {
      item.textContent = `${key}: ${value}`;
    }

    list.appendChild(item);
  });

  return list;
}
const userIdInput =
  document.getElementById("user-id");

const searchButton =
  document.getElementById("search-button");

const searchMessage =
  document.getElementById("search-message");

const userInfo =
  document.getElementById("user-info");

const userPosts =
  document.getElementById("user-posts");

const userTodos =
  document.getElementById("user-todos");

searchButton.addEventListener("click", searchUser);

async function searchUser() {
  const userId = userIdInput.value.trim();

  searchMessage.textContent = "";
  searchMessage.classList.remove("error");

  userInfo.replaceChildren();
  userPosts.replaceChildren();
  userTodos.replaceChildren();

  if (!userId) {
    searchMessage.textContent = "Please enter a user ID.";
    searchMessage.classList.add("error");
    return;
  }

  searchMessage.textContent = "Loading...";

  try {
    const [user, posts, todos] = await Promise.all([
      fetchJSON(`${BASE_URL}/users/${userId}`),
      fetchJSON(`${BASE_URL}/posts?userId=${userId}`),
      fetchJSON(`${BASE_URL}/todos?userId=${userId}`),
    ]);

    if (!user.id) {
      searchMessage.textContent =
        "User was not found. Please try another user ID";

      searchMessage.classList.add("error");
      userIdInput.value = "";
      return;
    }

    searchMessage.textContent = "";

    userInfo.appendChild(createDataList(user));

    posts.forEach((post) => {
      userPosts.appendChild(createDataList(post));
    });

    todos.forEach((todo) => {
      userTodos.appendChild(createDataList(todo));
    });
  } catch (error) {
    searchMessage.textContent =
      "Something went wrong. Please try again.";

    searchMessage.classList.add("error");
    console.error(error);
  }
}
const delayedButton =
  document.getElementById("delayed-button");

const delayedMessage =
  document.getElementById("delayed-message");

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function delayedRequest(
  url = `${BASE_URL}/users/1`
) {
  await wait(2000);

  const data = await fetchJSON(url);

  console.log(JSON.stringify(data, null, 2));

  return data;
}

delayedButton.addEventListener("click", async () => {
  delayedMessage.textContent = "Waiting ...";
  delayedMessage.classList.remove("error");

  try {
    await delayedRequest();

    delayedMessage.textContent =
      "Check console for the data";
  } catch (error) {
    delayedMessage.textContent =
      "Unable to retrieve the data.";

    delayedMessage.classList.add("error");
    console.error(error);
  }
});
