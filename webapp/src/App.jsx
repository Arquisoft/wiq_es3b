import { useState } from 'react'
import './App.css'

import { Start } from './components/Start'
import { Game } from './components/Game'

function App() {
  const [menuState, setMenuState] = useState(0)

  const goTo = (parameter) => {
    setMenuState(parameter)
  }

  return (
    <>
      {menuState === 0 && <Start goTo={(x) => goTo(x)}/>}
      {menuState === 1 && <Game goTo={(x) => goTo(x)}/>}
    </>
  )
}

export default App
