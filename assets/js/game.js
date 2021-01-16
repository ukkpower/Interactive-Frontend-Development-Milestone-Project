class MemoryCards {
    
    constructor() {
        this.gameData = [];
        this.cardData = [];

        this.currentLives = 0;
        this.levelLives = 0;
        this.level = 1;

        this.hasFlippedCard = false;
        this.lockDeck = false;
        this.firstCard, this.secondCard;
        this.trackMatches = 0;

        this.cardSelection = [];
    }

    startGame () {
        this.loadJSON((response) => {
            this.gameData = JSON.parse(response);}, 
            'gameData.json');

        this.loadJSON((response) => {
            this.cardData = JSON.parse(response);}, 
            'cardData.json');

        this.loadLevel();

        $(document).on("click", ".card:not(.flip)" , this.flipCard);

        $( "#start-overlay" ).click(function() {
            $(this).removeClass('visible');
        });

        $( "#game-over-overlay" ).click(function() {
            loadLevel ();
            $(this).removeClass('visible');
        });

        $( "#victory-overlay" ).click(function() {
            this.level++;
            loadLevel ();
            $(this).removeClass('visible');
        });
    }

    loadLevel () {
        this.levelLives = this.gameData[this.level-1].lives;
        this.currentLives = this.levelLives;
        this.updateLives(this.currentLives, 100);
        this.updateLevel(this.level);

        this.trackMatches = this.gameData[this.level-1].cards;

        let cards = this.randomCardSelection(this.gameData[this.level-1].cards);
        $(".card").remove();      
        this.addCards(cards);
    }

    loadJSON(callback, file) {   

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

    updateLives (lives, livesPercent) {
        fm.setPercentage(livesPercent, lives);
    }

    updateLevel (level) {
        $('#level').html(level);
    }

    addCards(cards) {
        for (let i = 0; i < cards.length; ++i) {
            $('#game-container').append(`<div class="card" data-framework="${this.cardData[cards[i]].name}">
                <div class="card-front card-face"><img src="assets/svg/${this.cardData[cards[i]].image}"></div>
                <div class="card-back card-face">?</div>
            </div>`)        
        }
    }

    randomCardSelection (value) {

        this.cardSelection = [];
        let randNum;

        for (var i = 0; i < value; i++) {
            randNum = this.randomNumber(0, 5, this.cardSelection);
            this.cardSelection.push(randNum);
            this.cardSelection.push(randNum);
        }

        return (this.shuffleCards (this.cardSelection));
    }

    randomNumber(min, max, blacklist) {  
    
        let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        let retv = 0;
        while(blacklist.indexOf(retv = rand(min,max)) > -1) { }
        return retv; 
    }

    shuffleCards (cards){
        for (var i = cards.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[rand]] = [cards[rand], cards[i]]
        }

        return cards
    }

    flipCard () {

        if (this.lockDeck) return;
        
        $(this).addClass('flip');

        if (this === this.firstCard) return;
        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = this;

            return;
        } 
        
        this.secondCard = this;
        checkForMatch();
    }

    checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

        isMatch ? cardsMatched() : noMatch();
    }

    noMatch() {
        this.lockDeck = true;

        this.currentLives = this.currentLives -1;

        let calcLivesPercent = calcLivesPercentage (currentLives, levelLives)
        updateLives (this.currentLives, calcLivesPercent);

        if (this.currentLives === 0) {
            gameOver();
        }
        
        setTimeout(() => {
            this.firstCard.classList.remove('flip');
            this.secondCard.classList.remove('flip');

            resetBoard();
        }, 1500);
    }

    cardsMatched() {
        this.trackMatches = this.trackMatches - 1;
        if (this.trackMatches == 0) {
            setTimeout(() => {
                $('#victory-overlay').addClass('visible');
            }, 1500);        
        }
        resetDeck();
    }

    resetDeck() {
        [this.hasFlippedCard, this.lockDeck] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    gameOver () {
        $('#game-over-overlay').addClass('visible');
        this.level = 1;
        resetDeck();
    }

    calcLivesPercentage (current, total) {
        return (Math.floor((current/total) * 100));
    }
};