const cards = document.querySelectorAll('.card');
var gameData;

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {

  this.classList.add('flip');

}

(function loadGameData () {
    loadJSON(function(response) {
  // Parse JSON string into object
    gameData = JSON.parse(response);}, 'gameData.json');
    console.log(gameData);
})();

function loadJSON(callback, file) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', `assets/${file}`, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}
