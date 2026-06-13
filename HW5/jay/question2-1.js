const API_BASE = "https://jsonplaceholder.typicode.com";
const NOT_FOUND_MESSAGE = "User was not found. Please try another user ID";
const DELAY_MS = 2000;

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function showMessage(box, text, isError = false) {
  box.textContent = text;
  box.className = isError ? "error" : "status";
}

/* ---------- Part 1: users table ---------- */

const USER_COLUMNS = [
  { header: "ID", getValue: (user) => user.id },
  { header: "Name", getValue: (user) => user.name },
  { header: "Email", getValue: (user) => user.email },
  { header: "City", getValue: (user) => user.address.city },
];

function buildUsersTable(users) {
  const table = document.createElement("table");

  const headerRow = table.createTHead().insertRow();
  for (const column of USER_COLUMNS) {
    const th = document.createElement("th");
    th.textContent = column.header;
    headerRow.appendChild(th);
  }

  const tbody = table.createTBody();
  for (const user of users) {
    const row = tbody.insertRow();
    for (const column of USER_COLUMNS) {
      row.insertCell().textContent = column.getValue(user);
    }
  }
  return table;
}

function initPart1() {
  const button = document.getElementById("load-users-button");
  const container = document.getElementById("users-container");

  button.addEventListener("click", async () => {
    showMessage(container, "Loading users…");
    try {
      const users = await fetchJson(`${API_BASE}/users`);
      container.replaceChildren(buildUsersTable(users));
    } catch (error) {
      showMessage(container, `Failed to load users: ${error.message}`, true);
    }
  });
}

/* ---------- Part 2: user lookup ---------- */

// Flattens nested objects ({ address: { city } } -> "address.city")
// so every value can be shown as a flat "key: value" line.
function toKeyValuePairs(obj, prefix = "") {
  const pairs = [];
  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      pairs.push(...toKeyValuePairs(value, name));
    } else {
      pairs.push([name, String(value)]);
    }
  }
  return pairs;
}

function buildKeyValueList(obj) {
  const list = document.createElement("ul");
  list.className = "kv-list";
  for (const [key, value] of toKeyValuePairs(obj)) {
    const item = document.createElement("li");

    const keySpan = document.createElement("span");
    keySpan.className = "kv-key";
    keySpan.textContent = `${key}: `;

    const valueSpan = document.createElement("span");
    valueSpan.className = "kv-value";
    valueSpan.textContent = value;

    item.append(keySpan, valueSpan);
    list.appendChild(item);
  }
  return list;
}

function fillSection(container, items) {
  container.replaceChildren(...items.map(buildKeyValueList));
}

function initPart2() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("user-id-input");
  const messageBox = document.getElementById("search-message");
  const userBox = document.getElementById("user-info");
  const postsBox = document.getElementById("user-posts");
  const todosBox = document.getElementById("user-todos");

  function clearResults() {
    userBox.replaceChildren();
    postsBox.replaceChildren();
    todosBox.replaceChildren();
  }

  async function searchUser(userId) {
    showMessage(messageBox, "Searching…");
    clearResults();

    try {
      const [user, posts, todos] = await Promise.all([
        fetchJson(`${API_BASE}/users/${userId}`),
        fetchJson(`${API_BASE}/posts?userId=${userId}`),
        fetchJson(`${API_BASE}/todos?userId=${userId}`),
      ]);

      // jsonplaceholder returns 404 (caught above) for a missing user,
      // but guard against an empty body as well.
      if (!user || Object.keys(user).length === 0) {
        throw new Error("empty user");
      }

      showMessage(messageBox, "");
      fillSection(userBox, [user]);
      fillSection(postsBox, posts);
      fillSection(todosBox, todos);
    } catch {
      showMessage(messageBox, NOT_FOUND_MESSAGE, true);
      input.value = "";
      input.focus();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const userId = input.value.trim();
    if (userId === "") {
      showMessage(messageBox, "Please enter a user ID.", true);
      return;
    }
    searchUser(userId);
  });
}

/* ---------- Part 3: delayed request ---------- */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetches the url and logs the JSON string to the console after 2 seconds.
// The fetch and the timer run concurrently, so the log happens at the
// 2-second mark (or when the fetch finishes, whichever is later).
async function delayedRequest(url = `${API_BASE}/users/1`) {
  const [data] = await Promise.all([fetchJson(url), delay(DELAY_MS)]);
  console.log(JSON.stringify(data));
  return data;
}

function initPart3() {
  const button = document.getElementById("delayed-request-button");
  const messageBox = document.getElementById("delayed-message");

  button.addEventListener("click", async () => {
    button.disabled = true;
    showMessage(messageBox, "Waiting ...");

    try {
      await delayedRequest();
      showMessage(messageBox, "Check console for the data");
    } catch (error) {
      showMessage(messageBox, `Something went wrong: ${error.message}`, true);
    } finally {
      button.disabled = false;
    }
  });
}

initPart1();
initPart2();
initPart3();
