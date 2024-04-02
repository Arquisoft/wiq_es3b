import { useState } from 'react'

import Nav from './components/Nav'
import { Start } from './components/Start'
import { Game } from './components/Game'
import { Participation } from './components/Participation'
import User from './components/User'

function App() {
  const [menuState, setMenuState] = useState(0)

  const goTo = (parameter) => {
    setMenuState(parameter)
  }

  return (
    <>
      {menuState === 0 && <User goTo={(x) => goTo(x)}/>}
      {menuState > 0 && <Nav goTo={(x) => goTo(x)}/>}
      {menuState === 1 && <Start goTo={(x) => goTo(x)}/>}
      {menuState === 2 && <Game gameMode="classic"/>}
      {menuState === 3 && <Game gameMode="infinite"/>}
      {menuState === 4 && <Game gameMode="onlyOneLife"/>}
      {menuState === 5 && <Game gameMode="category"/>}
      {menuState === 6 && <Participation goTo={(x) => goTo(x)}/>}
    </>
  )
}

export default App
