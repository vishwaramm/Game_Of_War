import React, { Component } from "react";
import Deck from "../classes/deck";
import Player from "../classes/player";
import PlayerDeck from "./player-deck";
import Round from "../classes/round";

class War extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: new Deck({ includeJoker: true }),
      players: [],
      rounds: [],
      messages: []
    };

    //TODO: Allow the UI to add players
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

  playNextCard(currentPlayer, noState, noPlay) {
    //the player already has a card in play so cancel the click
    if (currentPlayer.currentCard != null) return false;

    let players = [...this.state.players];
    currentPlayer.currentCard = currentPlayer.cards.pop();

    //if we popped from the array and there's nothing then this player lost
    if (currentPlayer.currentCard == null) {
      currentPlayer.lost = true;
      this.message(`${currentPlayer.name} lost. Out of cards!`);
    }

    //update player
    for (let i in players) {
      if (currentPlayer.name === players[i].name) {
        players[i] = currentPlayer;
        break;
      }
    }

    if (!noState) this.setState({ players });

    for (let i in players) {
      let p = players[i];

      if (p.currentCard === null && p.lost === false) {
        //TODO: show a 'waiting for other players' message
        return false;
      }
    }

    if (!noPlay) this.play();
  }

  play() {
    let cardsOnTable = [];
    let roundWinner = null;
    let round = new Round();
    let players = [...this.state.players];
    let messageQueue = [];
    /*
    if (cardsInPlay.length === 1) {
      //then someone ran out of cards
      let winner = cardsInPlay[0];
      round.winner = winner.player.name;
      round.messages = messageQueue;
      this.prependRound(round);
      return; //game over
    }
*/
    roundWinner = this.coreGameLogic(players, cardsOnTable, messageQueue);

    for (let index in cardsOnTable) {
      roundWinner.cards.unshift(cardsOnTable[index]);
    }

    roundWinner.roundWins++;

    var roundWinnerIndex = players.findIndex(function(current, index) {
      return current.name === roundWinner.name;
    });

    players[roundWinnerIndex] = roundWinner;
    let context = this;

    setTimeout(function() {
      for (let i in players) {
        players[i].currentCard = null;
      }

      context.setState({
        players: players
      });
    }, 3000);

    round.winner = roundWinner.name;
    round.messages = messageQueue;
    this.prependRound(round);
  }

  coreGameLogic(players, cardsOnTable, messageQueue) {
    let roundWinner = players[0];
    let playersInWar = {};

    messageQueue.push(
      `${roundWinner.name} played: ${roundWinner.currentCard.displayName()}`
    );

    cardsOnTable.push(roundWinner.currentCard);

    //players play their cards
    for (let index = 1; index < players.length; index++) {
      let player = players[index];

      if (player.lost) continue; //the current player already lost (this is if there are more than 2 players)

      messageQueue.push(
        `${player.name} played: ${player.currentCard.displayName()}`
      );

      var comparisonResult = this.compareCards(
        player.currentCard,
        roundWinner.currentCard
      );

      switch (comparisonResult) {
        case 1: //first card won
          roundWinner = player;
          break;
        case 2: //second card won
          //roundWinner already set
          break;
        case 0: //war
          playersInWar[roundWinner.name] = roundWinner;
          playersInWar[player.name] = player;
          break;
        default:
          break;
      }

      cardsOnTable.push(player.currentCard);
    }

    let warPlayers = [];
    for (let prop in playersInWar) {
      let player = playersInWar[prop];
      player.currentCard = null;

      warPlayers.push(player);
    }

    if (warPlayers.length > 0) {
      let warWinner = this.oneRoundOfWar(
        warPlayers,
        cardsOnTable,
        messageQueue
      );

      //if we have players in war and the roundWinner is not in the war,
      //then the roundWinner gets all the cards from war
      if (
        warWinner != null &&
        warPlayers.filter(function(p) {
          return p.name === roundWinner.name;
        }).length > 0
      ) {
        roundWinner = warWinner;
      }
    }

    return roundWinner;
  }

  compareCards(card1, card2) {
    if (card1.rank > card2.rank) {
      return 1;
    } else if (card2.rank > card1.rank) {
      return 2;
    } else {
      return 0;
    }
  }

  oneRoundOfWar(players, cardsOnTable, messageQueue) {
    let winner = null;

    messageQueue.push(`1-2-3-4 I de-clare WAR!`);

    for (let i = 0; i < players.length; i++) {
      let player = players[i];

      if (player.lost) continue;

      for (let x = 0; x < 4; x++) {
        let faceDownCard = player.cards.pop();
        cardsOnTable.push(faceDownCard);

        if (!faceDownCard) {
          messageQueue.push(
            `${player.name} lost! Ran out of cards during war.`
          );

          player.lost = true;
        }
      }
    }

    let remainingPlayers = players.filter(function(p) {
      return p.lost === false;
    });

    if (remainingPlayers.length === 1) {
      messageQueue.push(
        `${
          remainingPlayers[0].name
        } won the war. The rest of players ran out of cards.`
      );
      return remainingPlayers[0]; //the winner by default
    } else if (remainingPlayers.length === 0) {
      messageQueue.push(`All players in war lost.`);
      return null; //no one won, they all lost
    }

    for (let index in remainingPlayers) {
      this.playNextCard(remainingPlayers[index], true, true);
    }

    winner = this.coreGameLogic(remainingPlayers, cardsOnTable, messageQueue);

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
      <PlayerDeck
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
