const cards = document.querySelectorAll('.card');
let gameData = [];
let cardData = [];

let lives = 0;
let level = 2;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

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
