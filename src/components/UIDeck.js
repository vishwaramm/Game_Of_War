import React, { Component } from 'react';
import UICard from './UICard';

const UIDeck = ({ player, onCardClick }) => {

    const playerDeck = player.cards.map(c =>
        <UICard card={c} onClick={onCardClick} />
    );

    return (
        <ul key={player.name} className="player-deck">{playerDeck}</ul>
    );
};

export default UIDeck;