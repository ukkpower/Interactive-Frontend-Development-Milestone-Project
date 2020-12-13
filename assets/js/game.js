const cards = document.querySelectorAll('.card');

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {

  this.classList.add('flip');

}