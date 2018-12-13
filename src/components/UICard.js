import React, { Component } from "react";

const UICard = ({ card, onClick }) => {
  if (card.isFaceDown) {
    return (
      <li
        key={card.id}
        className="face-down card"
        onClick={() => {
          onClick(card);
        }}
      />
    );
  } else {
    return (
      <li key={card.id} className="card face-up">
        <span className="suit">{card.suit}</span>
        <span className="rank">{card.rank}</span>
      </li>
    );
  }
};

export default UICard;
