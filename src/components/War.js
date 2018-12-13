import React, { Component } from "react";
import Deck from "../classes/deck";
import UIDeck from "./UIDeck";

class War extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: new Deck(),
      players: [],
      turns: 0,
      currentPlayer: null
    };
  }

  deal() {
    let playerIndex = 0;
    this.state.deck.shuffle();

    while (this.state.deck.cards.length > 0) {
      if (playerIndex >= this.state.players.length) {
        playerIndex = 0;
      }

      let currentCard = this.state.deck.cards.pop();

      if (currentCard) {
        this.state.players[playerIndex].cards.push(currentCard);
        playerIndex++;
      }
    }
  }

  handleCardClick(card) {
    if (!card.isFaceDown) {
      return false; //no operation on face up card click
    }

    const cards = [...this.state.currentPlayer.cards];
    

  }

  renderPlayers() {
    const playerDecks = this.state.players.map(p => (
      <UIDeck player={p} onCardClick={this.handleCardClick} />
    ));
  }

  render() {
    <div className="game war-cards">{this.renderPlayers()}}</div>;
  }
}

export default War;
