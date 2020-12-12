const cards = document.querySelectorAll('.card');

console.log(cards);

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {

  this.classList.add('flip');

}