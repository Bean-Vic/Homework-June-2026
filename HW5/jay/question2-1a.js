const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const COLUMNS = [
  { header: "ID", getValue: (user) => user.id },
  { header: "Name", getValue: (user) => user.name },
  { header: "Username", getValue: (user) => user.username },
  { header: "Email", getValue: (user) => user.email },
  { header: "City", getValue: (user) => user.address.city },
  { header: "Phone", getValue: (user) => user.phone },
  { header: "Website", getValue: (user) => user.website },
  { header: "Company", getValue: (user) => user.company.name },
];

async function fetchUsers(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function buildTable(users) {
  const table = document.createElement("table");

  const headerRow = table.createTHead().insertRow();
  for (const column of COLUMNS) {
    const th = document.createElement("th");
    th.textContent = column.header;
    headerRow.appendChild(th);
  }

  const tbody = table.createTBody();
  for (const user of users) {
    const row = tbody.insertRow();
    for (const column of COLUMNS) {
      row.insertCell().textContent = column.getValue(user);
    }
  }

  return table;
}

function showMessage(container, text, isError = false) {
  const message = document.createElement("p");
  message.textContent = text;
  message.className = isError ? "error" : "status";
  container.replaceChildren(message);
}

async function renderUsers() {
  const container = document.getElementById("users-container");
  showMessage(container, "Loading users…");

  try {
    const users = await fetchUsers(USERS_URL);
    if (!Array.isArray(users) || users.length === 0) {
      showMessage(container, "No users found.");
      return;
    }
    container.replaceChildren(buildTable(users));
  } catch (error) {
    showMessage(container, `Failed to load users: ${error.message}`, true);
  }
}

document.addEventListener("DOMContentLoaded", renderUsers);
