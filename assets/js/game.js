let gameData = [];
let cardData = [];

let currentLives = 0;
let levelLives = 0;
let level = 1;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let trackMatches = 0;

let cardSelection = [];

(function startGame () {
    loadJSON(function(response) {
        gameData = JSON.parse(response);}, 
        'gameData.json');

    loadJSON(function(response) {
        cardData = JSON.parse(response);}, 
        'cardData.json');

    loadLevel();

    $(document).on("click", ".card:not(.flip)" , flipCard);

    $( "#start-overlay" ).click(function() {
        $(this).removeClass('visible');
    });

    $( "#game-over-overlay" ).click(function() {
        loadLevel ();
        $(this).removeClass('visible');
    });

    $( "#victory-overlay" ).click(function() {
        level++;
        loadLevel ();
        $(this).removeClass('visible');
    });

})();

function loadLevel () {
    levelLives = gameData[level-1].lives;
    currentLives = levelLives;
    updateLives(currentLives, 100);
    updateLevel(level);

    trackMatches = gameData[level-1].cards;

    let cards = randomCardSelection(gameData[level-1].cards);
    $(".card").remove();      
    addCards(cards);
}

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

function updateLives (lives, livesPercent) {
    fm.setPercentage(livesPercent, lives);
}

function updateLevel (level) {
    $('#level').html(level);
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

    console.log('click');

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

  isMatch ? cardsMatched() : noMatch();
}

function noMatch() {
  lockBoard = true;

  currentLives = currentLives -1;

  let calcLivesPercent = calcLivesPercentage (currentLives, levelLives)
  updateLives (currentLives, calcLivesPercent);

  if (currentLives === 0) {
      gameOver();
  }
  
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function cardsMatched() {
    trackMatches = trackMatches - 1;
    if (trackMatches == 0) {
        setTimeout(() => {
            $('#victory-overlay').addClass('visible');
        }, 1500);        
    }
    resetBoard();
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function gameOver () {
    $('#game-over-overlay').addClass('visible');
    level = 1;
    resetBoard();
}

function calcLivesPercentage (current, total) {
    return ((current/total) * 100).toFixed(3);
}