const tabButtons = document.getElementById("tab-buttons");
const buttons = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

tabButtons.addEventListener("click", (event) => {
  const clickedButton = event.target;

  if (!clickedButton.classList.contains("tab-button")) {
    return;
  }

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  contents.forEach((content) => {
    content.classList.remove("active");
  });

  clickedButton.classList.add("active");

  const city = clickedButton.dataset.city;
  const selectedContent = document.getElementById(city);

  selectedContent.classList.add("active");
});