const cards = document.querySelectorAll('.card');

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {

  this.classList.add('flip');

}

(function loadGameData () {
fetch('assets/gameData.json')
  .then(response => response.json())
  .then(data => {
  	// Do something with your data
  	console.log(data);
  });
})();

