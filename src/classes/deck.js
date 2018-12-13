import Card from './card';

class Deck {
    constructor(props) {
        this.cards = [];
        this.suits = {
            Hearts: 1,
            Diamonds: 2,
            Clubs: 3,
            Spades: 4
        };

        for (let suit in this.suits) {
            for (let i = 0; i < 13; i++) {
                let card = new Card();
                card.rank = i + 2;
                card.suit = suit;
                this.cards.push(card);
            }
        }
    }

    shuffle() { //fisher-yates randomization
        let currentIndex = this.cards.length;
        let temp = null;
        let randomIndex = 0;

        //while there remain elements to shuffle...
        while (currentIndex > 0) {
            //Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            //And swap it with the current element
            temp = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temp;
        }
    }
}

export default Deck;