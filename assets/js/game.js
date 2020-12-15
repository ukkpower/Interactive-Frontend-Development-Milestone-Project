const cards = document.querySelectorAll('.card');
let gameData = [];
let cardData = [];

let lives = 0;
let level = 1;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let cardSelection = [];

function flipCard() {

  //this.classList.add('flip');

}

(function startGame () {
    loadJSON(function(response) {
        gameData = JSON.parse(response);}, 
        'gameData.json');

    loadJSON(function(response) {
        cardData = JSON.parse(response);}, 
        'cardData.json');

    updateLives(gameData[level-1].lives);

    randomCardSelection(gameData[level-1].cards);

    addCards(gameData[level-1].cards);

    $(document).on("click", ".card" , function() {
        $(this).addClass('flip');
    });

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

function addCards(value) {
    for (let i = 0; i < value; ++i) {
        $('#game-container').append(`<div class="card">
            <div class="card-front card-face"><img src="assets/svg/${cardData[i].image}"></div>
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
        randNum = randomNumber(1, 6, cardSelection);
        cardSelection.push(randNum);
        cardSelection.push(randNum);
    }

    console.log(shuffleArr (cardSelection));
}

function randomNumber(min, max, blacklist) {  
    
    let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let retv = 0;
    while(blacklist.indexOf(retv = rand(min,max)) > -1) { }
    return retv; 
}


function shuffleArr (array){
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }

    return array
}