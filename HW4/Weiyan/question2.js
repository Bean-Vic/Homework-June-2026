const tabsContainer = document.querySelector('.tabs-container');
const allButtons = tabsContainer.querySelectorAll('button');
const allContent = document.querySelectorAll('.content');

tabsContainer.addEventListener('click', function(event) {

  if (event.target.tagName === 'BUTTON') {

    allButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    allContent.forEach(content => content.classList.remove('active'));

    const targetId = event.target.value;
    document.getElementById(targetId).classList.add('active');
  }
});