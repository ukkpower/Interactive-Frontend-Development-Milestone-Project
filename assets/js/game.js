const cards = document.querySelectorAll('.card');
let gameData = [];
let cardData = [];

let lives = 0;
let level = 5;

cards.forEach(card => card.addEventListener('click', flipCard));

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

    console.log(gameData[level-1].lives);

    $.each( cardData, function( key, value ) {
        $('#game-container').append(`<div class="card">
            <div class="card-front card-face"><img src="assets/svg/${value.image}"></div>
            <div class="card-back card-face">?</div>
        </div>`)
    });

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
