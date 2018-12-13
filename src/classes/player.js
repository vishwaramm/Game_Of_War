class Player {
  constructor(options) {
    this.name = options.name;
    this.cards = [];
    this.lost = false;
    this.roundWins = 0;
    this.myTurn = false;
    this.currentCard = null;
  }
}
