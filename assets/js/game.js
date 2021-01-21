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

        this.bgMusic = new Audio('assets/audio/bgMusic.mp3');
        this.bgMusic.volume = 0.4;
        this.bgMusic.loop = true;
        this.bgMusicMute = false;

        this.flipCardSound = new Audio('assets/audio/card-flip.mp3');
        this.matchCardsSound = new Audio('assets/audio/card-match.wav');
        this.noMatchCardsSound = new Audio('assets/audio/no-card-match.wav');
        this.gameVictorySound = new Audio('assets/audio/victory.wav');
        this.gameOverSound = new Audio('assets/audio/gameOver.wav');

    }

    startGame () {
        this.loadJSON((response) => {
            this.gameData = JSON.parse(response);}, 
            'gameData.json');

        this.loadJSON((response) => {
            this.cardData = JSON.parse(response);}, 
            'cardData.json');

        this.loadLevel();

        $(document).on("click", ".card:not(.flip)" , (event) => this.flipCard(event));

        $( "#start-overlay" ).click((event) => {
            $(event.currentTarget).removeClass('visible');
            if(!this.bgMusicMute) {this.playBgMusic()};
        });

        $( "#game-over-overlay" ).click((event) => {
            this.loadLevel();
            if(!this.bgMusicMute) {this.playBgMusic()};
            $(event.currentTarget).removeClass('visible');
        });

        $( "#victory-overlay" ).click((event) => {
            this.level++;
            this.loadLevel();
            if(!this.bgMusicMute) {this.playBgMusic()};
            $(event.currentTarget).removeClass('visible');
        });

        $( ".mute-button" ).click((event) => {
            if(this.bgMusicMute) {
                this.playBgMusic();
            } else {
                this.stopBgMusic();
            }
        });

    }

    loadLevel() {
        this.levelLives = this.gameData[this.level-1].lives;
        this.currentLives = this.levelLives;
        this.updateLives(this.currentLives, 100);
        this.updateLevel(this.level);

        this.trackMatches = this.gameData[this.level-1].cards;

        let cards = this.randomCardSelection(this.gameData[this.level-1].cards);
        $(".card").remove();
        this.setGridCol(this.gameData[this.level-1].cards);     
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

    setGridCol(cards) {
        const numCards = cards * 2;
        $('#card-container').removeClass();

        if (numCards === 4 ) {
            $('#card-container').addClass("card-grid-2");
        } else if (numCards === 6 ) {
            $('#card-container').addClass("card-grid-3");
        } else if (numCards === 8) {
            $('#card-container').addClass("card-grid-4");
        } else {
            $('#card-container').addClass("card-grid-4");
        }
    }

    addCards(cards) {
        for (let i = 0; i < cards.length; ++i) {
            $('#card-container').append(`<div class="card" data-framework="${this.cardData[cards[i]].name}">
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

    flipCard (event) {

        if (this.lockDeck) return;
        
        $(event.currentTarget).addClass('flip');
        this.flipCardSound.play();

        if (event.currentTarget === this.firstCard) return;
        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = event.currentTarget;

            return;
        } 
        
        this.secondCard = event.currentTarget;
        this.checkForMatch();
    }

    checkForMatch() {
        
        let isMatch = this.firstCard.dataset.framework === this.secondCard.dataset.framework;

        isMatch ? this.cardsMatched() : this.noCardsMatch();
    }

    noCardsMatch() {
        this.lockDeck = true;

        this.currentLives = this.currentLives -1;

        this.noMatchCardsSound.play();

        let calcLivesPercent = this.calcLivesPercentage (this.currentLives, this.levelLives)
        this.updateLives (this.currentLives, calcLivesPercent);

        if (this.currentLives === 0) {
            this.gameOver();
            return;
        }
        
        setTimeout(() => {
            $(this.firstCard).addClass("card-shake");
            $(this.secondCard).addClass("card-shake");
        }, 500);

        setTimeout(() => {
            $(this.firstCard).removeClass("flip card-shake");
            $(this.secondCard).removeClass("flip card-shake");
            this.resetDeck();
        }, 2000);
    }

    cardsMatched() {
        this.trackMatches = this.trackMatches - 1;
        
        this.matchCardsSound.play();


        $(this.firstCard).addClass("card-heartbeat");
        $(this.secondCard).addClass("card-heartbeat");

        if (this.trackMatches == 0) {
            setTimeout(() => {
                $('#victory-overlay').addClass('visible');
                this.stopBgMusic();
                this.gameVictorySound.play();
            }, 1500);        
        }
        this.resetDeck();
    }

    resetDeck() {
        [this.hasFlippedCard, this.lockDeck] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    gameOver () {
        $('#game-over-overlay').addClass('visible');
        this.stopBgMusic();
        this.gameOverSound.play();
        this.level = 1;
        this.resetDeck();
    }

    calcLivesPercentage (current, total) {
        return (Math.floor((current/total) * 100));
    }

    playBgMusic() {
        this.bgMusic.play();
        this.bgMusicMute = false;
        $('mute').removeClass('unmute').addClass('mute');
    }

    stopBgMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.bgMusicMute = true;
        $('mute').removeClass('unmute').addClass('mute');
    }
};