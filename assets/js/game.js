const cards = document.querySelectorAll('.card');
let gameData = [];
let cardData = [];

let lives = 0;
let level = 1;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let cardSelection = [];

(function startGame () {
    loadJSON(function(response) {
        gameData = JSON.parse(response);}, 
        'gameData.json');

    loadJSON(function(response) {
        cardData = JSON.parse(response);}, 
        'cardData.json');

    updateLives(gameData[level-1].lives);

    let cards = randomCardSelection(gameData[level-1].cards);

    addCards(cards);

    $(document).on("click", ".card" , flipCard);

})();

function loadJSON(callback, file) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', `assets/data/${file}`, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function updateLives (lives) {
    $('#lives').html(lives);
}

function addCards(cards) {
    for (let i = 0; i < cards.length; ++i) {
        $('#game-container').append(`<div class="card" data-framework="${cardData[cards[i]].name}">
            <div class="card-front card-face"><img src="assets/svg/${cardData[cards[i]].image}"></div>
            <div class="card-back card-face">?</div>
        </div>`)        
    }
}

function randomCardSelection (value) {
    //6 card types
    //Total 12 cards per screen
    cardSelection = [];
    let randNum;

    for (i = 0; i < value; i++) {
        randNum = randomNumber(0, 5, cardSelection);
        cardSelection.push(randNum);
        cardSelection.push(randNum);
    }

    return (shuffleCards (cardSelection));
}

function randomNumber(min, max, blacklist) {  
    
    let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let retv = 0;
    while(blacklist.indexOf(retv = rand(min,max)) > -1) { }
    return retv; 
}


function shuffleCards (cards){
    for (var i = cards.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[rand]] = [cards[rand], cards[i]]
    }

    return cards
}

function flipCard () {

    if (lockBoard) return;
    
    $(this).addClass('flip');

    if (this === firstCard) return;
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    } 
    
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? console.log('match') : console.log('no match');
}

