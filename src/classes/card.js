class Card {
  constructor() {
    this.rank = 0;
    this.suit = 0;
    this.id = "";
    this.isFaceDown = true;
  }

  displayName() {
    let display = "";

    if (this.rank <= 10) {
      display = `${this.rank} of ${this.suit}`;
    } else if (this.rank === 11) {
      display = `Jack of ${this.suit}`;
    } else if (this.rank === 12) {
      display = `Queen of ${this.suit}`;
    } else if (this.rank === 13) {
      display = `King of ${this.suit}`;
    } else {
      display = `Ace of ${this.suit}`;
    }

    return display;
  }
}

export default Card;
