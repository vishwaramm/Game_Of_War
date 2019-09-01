import React, { Component } from "react";

class UIDeck extends Component {
  renderPlayerDeck = player => {
    if (this.props.player.currentCard != null) {
      let deckClass = `face-up card ${this.props.player.currentCard.suit.toLowerCase()}`;
      return (
        <div className={deckClass}>
          <p className="rank">{this.props.player.currentCard.name}</p>
        </div>
      );
    } else {
      return (
        <div
          className="card"
          onClick={() => {
            this.props.onCardClick(this.props.player);
          }}
        />
      );
    }
  };

  render() {
    return (
      <div className="player">
        <label>Player Name: </label>
        <label className="player-name">{this.props.player.name}</label>
        <br />
        <label>Cards: </label>
        <label>{this.props.player.cards.length}</label>
        <br />
        <label>Rounds Won: </label>
        <label>{this.props.player.roundWins}</label>
        {this.renderPlayerDeck(this.props.player)}
      </div>
    );
  }
}

export default UIDeck;
