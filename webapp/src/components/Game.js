import React from 'react';

export const Game = ({ goTo }) => {
  return (
    <div>
      <h1>Game</h1>
      <button onClick={() => goTo(0)}>Menu</button>
    </div>
  );
};
