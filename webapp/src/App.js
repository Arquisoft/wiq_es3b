import { useState } from 'react'

import Nav from './components/Nav'
import { Start } from './components/Start'
import { Game } from './components/Game'
import { PostGame } from './components/PostGame'
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
      {menuState === 2 && <Game goTo={(x) => goTo(x)}/>}
      {menuState === 3 && <PostGame />}
      {menuState === 4 && <Participation goTo={(x) => goTo(x)}/>}
    </>
  )
}

export default App
