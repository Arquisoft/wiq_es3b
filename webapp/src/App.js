import { useState } from 'react'

import Nav from './components/Nav'
import { Start } from './components/Start'
import { Game } from './components/Game'
import { Participation } from './components/Participation'
import User from './components/User'

import { IntlProvider } from 'react-intl';
import messages_en from './messages/messages_en.json';
import messages_es from './messages/messages_es.json';

function App() {

  const [locale, setLocale] = useState('en');
  const messages = locale === 'en' ? messages_en : messages_es;

  const [daltonicMode, setDaltonicMode] = useState(false);

  const [menuState, setMenuState] = useState(0);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
  };

  const changeDaltonicMode = () => {
    setDaltonicMode(!daltonicMode);
  };

  const goTo = (parameter) => {
    setMenuState(parameter)
  };

  return (
    <>
      <IntlProvider locale={locale} messages={messages}>
        {menuState === 0 && <User goTo={(x) => goTo(x)} changeLanguage={(y) => changeLanguage(y)} locale={locale}/>}
        {menuState > 0 && <Nav goTo={(x) => goTo(x)} changeLanguage={(y) => changeLanguage(y)} locale={locale}
          isInGame={menuState >= 2 && menuState <= 6} changeDaltonicMode={() => changeDaltonicMode()} />}
        {menuState === 1 && <Start goTo={(x) => goTo(x)}/>}
        {menuState === 2 && <Game gameMode="classic" locale={locale} daltonicMode={daltonicMode} />}
        {menuState === 3 && <Game gameMode="infinite" locale={locale} daltonicMode={daltonicMode} />}
        {menuState === 4 && <Game gameMode="threeLife" locale={locale} daltonicMode={daltonicMode} />}
        {menuState === 5 && <Game gameMode="category" locale={locale} daltonicMode={daltonicMode} />}
        {menuState === 6 && <Game gameMode="custom" locale={locale} daltonicMode={daltonicMode} />}
        {menuState === 7 && <Participation goTo={(x) => goTo(x)}/>}
      </IntlProvider>
    </>
  )
}

export default App
