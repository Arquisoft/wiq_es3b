import React, { useState } from 'react';
import './App.css';
import { Game } from './components/Game';
import { Participation } from './components/Participation';

function App() {
  const [menuState, setMenuState] = useState(0);

  const goTo = (parameter) => {
    setMenuState(parameter);
  };

  return (
    <>
      {menuState === 0 && <Game goTo={(x) => goTo(x)} />}
      {menuState === 1 && <Participation goTo={(x) => goTo(x)} />}
    </>
  );
}

export default App;
