import Card from "./card";

class Deck {
  constructor(props) {
    this.cards = [];
    this.ranks = {
      JK: 15,
      A: 14,
      K: 13,
      Q: 12,
      J: 11,
      "10": 10,
      "9": 9,
      "8": 8,
      "7": 7,
      "6": 6,
      "5": 5,
      "4": 4,
      "3": 3,
      "2": 2
    };

    this.ranks = { ...this.ranks, ...props.ranks };
    this.suits = {
      Hearts: 1,
      Diamonds: 2,
      Clubs: 3,
      Spades: 4
    };

    for (let suit in this.suits) {
      for (let name in this.ranks) {
        let rank = this.ranks[name];

        if (name === "JK") continue; //joker has no suit

        let card = new Card();
        card.rank = rank;
        card.suit = suit;
        card.name = name;
        card.id = `${suit}_${rank}`;
        this.cards.push(card);
      }
    }

    if (props.includeJoker) {
      for (let i = 0; i < 2; i++) {
        let card = new Card();
        card.rank = this.ranks["JK"];
        card.name = "JK";
        card.suit = "";
        card.id = `joker_${i}`;
        this.cards.push(card);
      }
    }
  }

  shuffle() {
    //fisher-yates randomization
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
