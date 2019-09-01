class Card {
  constructor() {
    this.rank = 0;
    this.suit = 0;
    this.name = "";
    this.id = "";
    this.isFaceDown = true;
  }

  displayName() {
    let display = `${this.name} of ${this.suit}`;

    return display;
  }
}

export default Card;
