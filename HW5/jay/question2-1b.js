const API_BASE = "https://jsonplaceholder.typicode.com";
const NOT_FOUND_MESSAGE = "User was not found. Please try another user ID";

const form = document.getElementById("search-form");
const input = document.getElementById("user-id-input");
const messageBox = document.getElementById("message");
const resultsBox = document.getElementById("results");

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

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

function buildSection(title, items) {
  const section = document.createElement("section");
  section.className = "result-section";

  const heading = document.createElement("h2");
  heading.textContent = title;
  section.appendChild(heading);

  for (const item of items) {
    section.appendChild(buildKeyValueList(item));
  }
  return section;
}

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.className = isError ? "error" : "status";
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "";
}

async function searchUser(userId) {
  showMessage("Searching…");
  resultsBox.replaceChildren();

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

    clearMessage();
    resultsBox.replaceChildren(
      buildSection("User", [user]),
      buildSection(`Posts (${posts.length})`, posts),
      buildSection(`Todos (${todos.length})`, todos),
    );
  } catch {
    showMessage(NOT_FOUND_MESSAGE, true);
    input.value = "";
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const userId = input.value.trim();
  if (userId === "") {
    showMessage("Please enter a user ID.", true);
    return;
  }
  searchUser(userId);
});
