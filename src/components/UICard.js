import React from "react";

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
      <li className="card face-up">
        <div className="suit" />
        <div className="rank" />
        <p className="name">{card.displayName()}</p>
      </li>
    );
  }
};

export default UICard;
