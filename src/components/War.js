import React, { Component } from "react";
import Deck from "../classes/deck";
import Player from "../classes/player";
import UIDeck from "./UIDeck";

class Round {
  constructor() {
    this.round = 0;
    this.winner = "";
    this.messages = [];
  }
}

class War extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: new Deck(),
      players: [],
      rounds: [],
      messages: []
    };

    this.state.players.push(new Player({ name: "vish" }));
    this.state.players.push(new Player({ name: "The Robot" }));
    this.deal();
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

  handleCardClick(player) {
    this.playNextCard(player);
  }

  message(msg) {
    let messages = [...this.state.messages];

    if (msg.constructor === Array) {
      messages = messages.concat(msg);
    } else {
      messages.push(msg);
    }

    this.setState({ messages });
  }

  prependRound(round) {
    let rounds = [...this.state.rounds];

    round.round = rounds.length + 1;
    rounds.unshift(round);

    this.setState({ rounds });
  }

  playNextCard(currentPlayer) {
    //the player already has a card in play so cancel the click
    if (currentPlayer.currentCard != null) return false;

    let players = [...this.state.players];
    currentPlayer.currentCard = currentPlayer.cards.pop();

    //if we popped from the array and there's nothing then this player lost
    if (currentPlayer.currentCard == null) {
      currentPlayer.lost = true;
      this.message(`${currentPlayer.name} lost. Out of cards!`);
    }

    //remove player and add back to array
    for (let i in players) {
      if (currentPlayer.name === players[i].name) {
        players[i] = currentPlayer;
        break;
      }
    }

    this.setState({ players });

    for (let i in players) {
      let p = players[i];

      if (p.currentCard === null && p.lost === false) {
        //TODO: show a 'waiting for other players' message
        return false;
      }
    }

    this.play();
  }

  play() {
    let cardsInPlay = [];
    let faceDownCardsInPlay = [];
    let roundWinner = null;
    let max = 0;
    let round = new Round();
    let warEvent = {
      exit: false
    };

    let players = [...this.state.players];
    let messageQueue = [];

    //players play their cards
    for (let index in players) {
      let player = players[index];

      if (player.lost) continue; //the current player already lost (this is if there are more than 2 players)

      if (player.currentCard == null) {
        messageQueue.push(`${player.name} lost. Out of cards!`);
        player.lost = true;
        players[index] = player;
        continue; //this player lost, they ran out of cards
      }

      cardsInPlay.push({
        card: player.currentCard,
        player: player
      });

      messageQueue.push(
        `${player.name} played: ${player.currentCard.displayName()}`
      );
    }

    if (cardsInPlay.length === 1) {
      //then someone ran out of cards
      let winner = cardsInPlay[0];
      round.winner = winner.player.name;
      round.messages = messageQueue;
      this.prependRound(round);
      return; //game over
    }

    for (let index in cardsInPlay) {
      let inPlay = cardsInPlay[index];

      if (inPlay.card.rank > max) {
        max = inPlay.card.rank;
        roundWinner = inPlay;
      } else if (inPlay.card.rank === max) {
        let warWinner = this._handleWar(
          roundWinner,
          inPlay,
          faceDownCardsInPlay,
          warEvent
        );

        if (warEvent.exit) break; //war told us to exit loop

        if (warWinner) {
          roundWinner = warWinner;
        }
      }
    }

    if (warEvent.exit) return; //end game, war told us to end the game

    for (let index in cardsInPlay) {
      roundWinner.player.cards.unshift(cardsInPlay[index].card);
    }

    for (let index in faceDownCardsInPlay) {
      roundWinner.player.cards.unshift(faceDownCardsInPlay[index]);
    }

    roundWinner.player.roundWins++;

    var roundWinnerIndex = players.findIndex(function(current, index) {
      return current.name === roundWinner.player.name;
    });

    players[roundWinnerIndex] = roundWinner.player;
    let context = this;

    setTimeout(function() {
      for (let i in players) {
        players[i].currentCard = null;
      }

      context.setState({
        players: players
      });
    }, 5000);

    round.winner = roundWinner.player.name;
    round.messages = messageQueue;
    this.prependRound(round);
  }

  _handleWar(player1, player2, faceDownCardsInPlay, e) {
    let card1 = { rank: 0 };
    let card2 = { rank: 0 };
    let messageQueue = [];
    let winner = null;

    messageQueue.push(`1-2-3-4 I de-clare WAR!`);

    while (card1.rank === card2.rank) {
      let faceDownCard1 = player1.player.cards.pop();

      if (!faceDownCard1) {
        messageQueue.push(
          `${player1.player.name} lost! Ran out of cards during war.`
        );
        messageQueue.push(`${player2.player.name} is the winner!`);
        e.exit = true; //tell caller to exit loop
        break;
      }

      let faceDownCard2 = player2.player.cards.pop();

      if (!faceDownCard2) {
        messageQueue.push(
          `${player2.player.name} lost! Ran out of cards during war.`
        );

        messageQueue.push(`${player1.player.name} is the winner!`);
        e.exit = true; //tell caller to exit loop
        break;
      }

      faceDownCardsInPlay.push(faceDownCard1);
      faceDownCardsInPlay.push(faceDownCard2);

      let cardInPlay1 = player1.player.cards.pop();

      if (!cardInPlay1) {
        messageQueue.push(
          `${player1.player.name} lost! Ran out of cards during war.`
        );
        messageQueue.push(`${player2.player.name} is the winner!`);
        e.exit = true; //tell caller to exit loop
        break;
      }

      let cardInPlay2 = player2.player.cards.pop();

      if (!cardInPlay2) {
        messageQueue.push(
          `${player2.player.name} lost! Ran out of cards during war.`
        );
        messageQueue.push(`${player1.player.name} is the winner!`);
        e.exit = true; //tell caller to exit loop
        break;
      }

      faceDownCardsInPlay.push(cardInPlay1);
      faceDownCardsInPlay.push(cardInPlay2);

      if (card1.rank > card2.rank) {
        winner = player1;
        break;
      } else if (card1.rank < card2.rank) {
        winner = player2;
        break;
      }
    }

    this.message(messageQueue);

    return winner;
  }

  renderMessages(messages) {
    return messages.map((m, index) => {
      return (
        <div key={index} className="message">
          {m}
        </div>
      );
    });
  }

  renderRounds(rounds) {
    return rounds.map((r, index) => {
      return (
        <div key={index} className="round">
          <h2>Round {r.round}</h2>
          <label>Winner: </label>
          <span>{r.winner}</span>
          <br />
          <br />
          {this.renderMessages(r.messages)}
          <hr />
        </div>
      );
    });
  }

  renderPlayers() {
    const playerDecks = this.state.players.map(p => (
      <UIDeck
        key={p.name}
        player={p}
        onCardClick={card => {
          this.handleCardClick(card);
        }}
      />
    ));

    return playerDecks;
  }

  getCurrentPlayer(card) {
    let player = this.state.players.filter(function(p) {
      let cards = p.cards.filter(function(currentCard) {
        if (currentCard.id === card.id) return true;

        return false;
      });

      if (cards.length === 0) return false;

      return true;
    });

    return player[0];
  }

  renderWinner() {
    if (this.state.roundWinner) {
      return (
        <div className="round-winner">
          {this.state.roundWinner} won the round!
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="game war-cards">
        <h1>Game of War</h1>
        <div className="players">{this.renderPlayers()}</div>
        <div className="clearfix" />
        <br />
        <br />
        <div className="messages">
          {this.renderWinner()}
          {this.renderMessages(this.state.messages)}
          {this.renderRounds(this.state.rounds)}
        </div>
      </div>
    );
  }
}

export default War;
