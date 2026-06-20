const tabs = document.querySelector('#tabs');
const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

tabs.addEventListener('click', (event) => {
  const clickedButton = event.target.closest('.tab-button');

  if (clickedButton === null) {
    return;
  }

  const selectedCity = clickedButton.dataset.city;

  buttons.forEach((button) => {
    button.classList.toggle('active', button === clickedButton);
  });

  contents.forEach((content) => {
    content.classList.toggle(
      'active',
      content.dataset.cityContent === selectedCity,
    );
  });
});
