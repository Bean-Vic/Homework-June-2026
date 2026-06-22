// part2.js

function renderList(elementId, data) {
  const ul = document.getElementById(elementId);
  ul.innerHTML = "";

  if (Array.isArray(data)) {
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `id: ${item.id} | title: ${item.title}`;
      ul.appendChild(li);
    });
  } else {
    for (const [key, value] of Object.entries(data)) {
      const displayValue =
        typeof value === "object" ? JSON.stringify(value) : value;
      const li = document.createElement("li");
      li.textContent = `${key}: ${displayValue}`;
      ul.appendChild(li);
    }
  }
}

document.getElementById("search-btn").addEventListener("click", async () => {
  const idInput = document.getElementById("user-id-input");
  const errorDiv = document.getElementById("part2-error");
  const contentDiv = document.getElementById("part2-content");
  const id = idInput.value.trim();

  errorDiv.textContent = "";
  contentDiv.style.display = "none";

  if (!id) return;

  try {
    const [userRes, postsRes, todosRes] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`),
      fetch(`https://jsonplaceholder.typicode.com/todos?userId=${id}`),
    ]);

    if (!userRes.ok) {
      errorDiv.textContent = "User was not found. Please try another user ID";
      idInput.value = "";
      return;
    }

    const userData = await userRes.json();
    const postsData = await postsRes.json();
    const todosData = await todosRes.json();

    renderList("user-info-list", userData);
    renderList("user-posts-list", postsData);
    renderList("user-todos-list", todosData);

    contentDiv.style.display = "block";
  } catch (error) {
    errorDiv.textContent = "An error occurred while fetching data.";
  }
});
