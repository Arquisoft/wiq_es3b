import React from 'react';

export const Participation = ({ goTo }) => {
  return (
    <div>
      <h1>Participation</h1>
      <button onClick={() => goTo(0)}>Menu</button>
    </div>
  );
};
