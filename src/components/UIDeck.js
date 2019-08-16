import React, { Component } from "react";

class UIDeck extends Component {
  renderPlayerDeck = player => {
    if (this.props.player.currentCard != null) {
      return (
        <div className="player-deck face-up">
          <div className="suit" />
          <div className="rank" />
          <p className="name">{this.props.player.currentCard.displayName()}</p>
        </div>
      );
    } else {
      return (
        <div
          className="player-deck"
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
        {this.renderPlayerDeck(this.props.player)}
      </div>
    );
  }
}

export default UIDeck;
