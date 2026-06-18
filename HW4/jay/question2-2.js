const tabContent = {
  London: "London is the capital city of England.",
  Paris: "Paris is the capital of France.",
  Tokyo: "Tokyo is the capital of Japan.",
};

const DEFAULT_TAB = "London";

const tabBar = document.getElementById("tabBar");
const title = document.getElementById("content-title");
const description = document.getElementById("content-description");

function selectTab(name) {
  // Update content
  title.textContent = name;
  description.textContent = tabContent[name];

  // Update highlight: only the active button is highlighted
  const buttons = tabBar.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === name);
  });
}

// Event delegation: a single listener on the tab bar handles every button click
tabBar.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !tabBar.contains(button)) return;
  selectTab(button.dataset.tab);
});

// By default, the London tab is selected
selectTab(DEFAULT_TAB);
