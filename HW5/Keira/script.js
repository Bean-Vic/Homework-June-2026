const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const loadUsersButton = document.querySelector("#load-users-button");
const usersTableBody = document.querySelector("#users-table-body");
const usersError = document.querySelector("#users-error");

const searchForm = document.querySelector("#search-form");
const userIdInput = document.querySelector("#user-id-input");
const searchError = document.querySelector("#search-error");
const userInfoList = document.querySelector("#user-info-list");
const userPostsList = document.querySelector("#user-posts-list");
const userTodosList = document.querySelector("#user-todos-list");

const delayedRequestButton = document.querySelector("#delayed-request-button");
const delayedStatus = document.querySelector("#delayed-status");

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.httpStatus = response.status;
    throw error;
  }

  return response.json();
}

function setButtonLoading(button, isLoading, loadingText) {
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.defaultText;
}

function clearElement(element) {
  element.replaceChildren();
}

function formatValue(value) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${formatValue(nestedValue)}`)
      .join(", ");
  }

  return String(value);
}

function renderKeyValueList(container, data) {
  clearElement(container);

  Object.entries(data).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.textContent = `${key}: ${formatValue(value)}`;
    container.append(item);
  });
}

function renderCollection(container, items) {
  clearElement(container);

  items.forEach((item) => {
    const listItem = document.createElement("li");
    const nestedList = document.createElement("ul");

    renderKeyValueList(nestedList, item);
    listItem.append(nestedList);
    container.append(listItem);
  });
}

function renderUsersTable(users) {
  clearElement(usersTableBody);

  users.forEach((user) => {
    const row = document.createElement("tr");
    const cells = [user.id, user.name, user.email, user.address?.city ?? ""];

    cells.forEach((cellValue) => {
      const cell = document.createElement("td");
      cell.textContent = cellValue;
      row.append(cell);
    });

    usersTableBody.append(row);
  });
}

async function loadUsers() {
  usersError.textContent = "";
  setButtonLoading(loadUsersButton, true, "Loading...");

  try {
    const users = await fetchJson(`${API_BASE_URL}/users`);
    renderUsersTable(users);
  } catch (error) {
    usersError.textContent = "Unable to load users. Please try again later.";
    console.error(error);
  } finally {
    setButtonLoading(loadUsersButton, false);
  }
}

function clearSearchResults() {
  searchError.textContent = "";
  clearElement(userInfoList);
  clearElement(userPostsList);
  clearElement(userTodosList);
}

function handleMissingUser() {
  searchError.textContent = "User was not found. Please try another user ID";
  userIdInput.value = "";
  userIdInput.focus();
}

async function searchUser(event) {
  event.preventDefault();
  clearSearchResults();

  const userId = userIdInput.value.trim();

  if (!userId) {
    handleMissingUser();
    return;
  }

  setButtonLoading(searchForm.querySelector("button"), true, "Searching...");

  const urls = [
    `${API_BASE_URL}/users/${encodeURIComponent(userId)}`,
    `${API_BASE_URL}/posts?userId=${encodeURIComponent(userId)}`,
    `${API_BASE_URL}/todos?userId=${encodeURIComponent(userId)}`,
  ];

  try {
    const [user, posts, todos] = await Promise.all(urls.map(fetchJson));

    if (!user || Object.keys(user).length === 0) {
      handleMissingUser();
      return;
    }

    renderKeyValueList(userInfoList, user);
    renderCollection(userPostsList, posts);
    renderCollection(userTodosList, todos);
  } catch (error) {
    if (error.httpStatus === 404) {
      handleMissingUser();
      return;
    }

    searchError.textContent =
      "Unable to retrieve user details. Please try again later.";
    console.error(error);
  } finally {
    setButtonLoading(searchForm.querySelector("button"), false);
  }
}

async function delayedRequest(
  url = `${API_BASE_URL}/users/${userIdInput.value.trim() || 1}`
) {
  const data = await fetchJson(url);

  await new Promise((resolve) => {
    window.setTimeout(resolve, 2000);
  });

  console.log(JSON.stringify(data));
  return data;
}

async function handleDelayedRequest() {
  delayedStatus.textContent = "Waiting ...";
  setButtonLoading(delayedRequestButton, true, "Sending...");

  try {
    await delayedRequest();
    delayedStatus.textContent = "Check console for the data";
  } catch (error) {
    delayedStatus.textContent = "Unable to complete delayed request.";
    console.error(error);
  } finally {
    setButtonLoading(delayedRequestButton, false);
  }
}

loadUsersButton.addEventListener("click", loadUsers);
searchForm.addEventListener("submit", searchUser);
delayedRequestButton.addEventListener("click", handleDelayedRequest);
