// Question.js
import React, { useState, useEffect, useContext } from 'react';
import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { SessionContext } from '../SessionContext';
import correctSound from '../audio/correct.mp3';
import incorrectSound from '../audio/incorrect.mp3';
import activateSound from '../audio/activate.mp3';
import soundOnImage from '../assets/sonidoON.png';
import soundOffImage from '../assets/sonidoOFF.png';
import vidaImg from '../assets/vida.png';

const N_QUESTIONS = 10;
const MAX_TIME = 240;

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);
const activateAudio = new Audio(activateSound);

const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

export const finishByQuestions = (segundos, MAX_TIME) => {
    localStorage.setItem("tiempoUsado", MAX_TIME - segundos);
    localStorage.setItem("tiempoRestante", segundos);
};

export const finishByTime = (sonido) => {
    localStorage.setItem("tiempoUsado", MAX_TIME);
    localStorage.setItem("tiempoRestante", 0);
    if (sonido) { incorrectAudio.play(); }
};

export const handleClassicGameFinish = (nQuestion, numberCorrect, numberIncorrect, 
        segundos, sonido, goTo, setGameFinished) => {
    if (nQuestion === N_QUESTIONS) {
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", numberIncorrect);
        finishByQuestions(segundos, MAX_TIME);
        setGameFinished(true); goTo(1);
    }
    if (segundos === 1) {
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", numberIncorrect);
        finishByTime(sonido);
        setGameFinished(true); goTo(1);
    }
};

export const handleOOLGameFinish = (numberCorrect, segundosInfinite, goTo, setGameFinished) => {
    localStorage.setItem("pAcertadas", numberCorrect);
    localStorage.setItem("tiempoUsado", segundosInfinite);
    setGameFinished(true); goTo(1);
};

export const handelInfiniteGameFinish = (numberCorrect, numberIncorrect, segundosInfinite, goTo, setGameFinished) => {
    localStorage.setItem("pAcertadas", numberCorrect);
    localStorage.setItem("pFalladas", numberIncorrect);
    localStorage.setItem("tiempoUsado", segundosInfinite);
    setGameFinished(true); goTo(1);
};

export const reloadF = (setSegundos, setSegundosInfinite, setNQuestion, setNumberCorrect, setNumberIncorrect, setReload) => {

    setSegundos(MAX_TIME);
    setSegundosInfinite(0);
    setNQuestion(-1);
    setNumberCorrect(0);
    setNumberIncorrect(0);
    setReload(false);
};

const Question = ({ goTo, setGameFinished, gameMode, category, restart }) => {

    localStorage.setItem("pAcertadas", 0);
    localStorage.setItem("pFalladas", 0);
    const {sessionData}=useContext(SessionContext);
    const userToken = sessionData ? sessionData.token : '';

    const [reload, setReload] = useState(restart);

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [isSelected, setIsSelected] = useState(false);
    
    const [correct, setCorrect] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);
    const [numberIncorrect, setNumberIncorrect] = useState(0);
    const [nQuestion, setNQuestion] = useState(-1);

    const [segundos, setSegundos] = useState(MAX_TIME);
    const [segundosInfinite, setSegundosInfinite] = useState(0);
    const [sonido, setSonido] = useState(true);

    const [vidas, setVidas] = useState(3);

    const images = [];
    for (let i = 0; i < vidas; i++) {
        images.push(<img className='vidaImg' key={i} src={ vidaImg } alt="Vida" />);
    }

    if (reload) { reloadF(setSegundos, setSegundosInfinite, setNQuestion, setNumberCorrect, setNumberIncorrect, setReload); }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (gameMode !== "infinite" && gameMode !== "threeLife") {
                setSegundos(segundos => {
                    if (segundos === 1 ) { clearInterval(intervalId); finishGameByTime(segundos); }
                    return segundos - 1;
                })
            } else {
                setSegundosInfinite(segundosInfinite => {
                    return segundosInfinite + 1;
                })
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const finishGameByTime = (segundos) => {
        handleClassicGameFinish(nQuestion, numberCorrect, numberIncorrect, 
            segundos, sonido, goTo, setGameFinished);
    };

    const formatTiempo = (segundos) => {
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
    };

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`${gatewayUrl}/api/questions/create?category=${category}&lang=en`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            const data = await response.json();

                setQuestion(data.question);
                setCorrect(data.correct);
                setOptions(shuffleOptions([data.correct, ...data.incorrects]));

                setSelectedOption(null);
                setIsSelected(false);
                setNQuestion((prevNQuestion) => prevNQuestion + 1);
            
            if (gameMode === "classic" || gameMode === "category") {
                handleClassicGameFinish(nQuestion, numberCorrect, numberIncorrect, segundos, 
                            sonido, goTo, setGameFinished);
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const getBackgroundColor = (option, index) => {
        if (selectedOption == null) return 'transparent';
        if (!isCorrect(option) && index === selectedIndex) return 'red';
        if (isCorrect(option)) return 'green';
    };

    // @SONAR_STOP@
    // sonarignore:start
    const shuffleOptions = (options) => {
        //NOSONAR
        return options.sort(() => Math.random() - 0.5); //NOSONAR
        //NOSONAR
    };
    // sonarignore:end
    // @SONAR_START@

    const handleSubmit = (option, index) => {
        if (isSelected) return;

        setSelectedOption(option);
        setSelectedIndex(index);
        setIsSelected(true);

        if (isCorrect(option)) {
            setNumberCorrect(numberCorrect + 1);
            if (sonido) { correctAudio.play(); }
            if (gameMode === 'threeLife') {
                setTimeout(() => {
                    fetchQuestion();
                }, 1000);
            }
        } else {
            if (sonido) { incorrectAudio.play(); }
            setNumberIncorrect(numberIncorrect + 1);
            setTimeout(() => {
                if (gameMode === 'threeLife') {
                    setVidas(vidas - 1);
                    if (vidas === 1) { handleOOLGameFinish(numberCorrect, segundosInfinite, goTo, setGameFinished); }
                    else { fetchQuestion(); }
                }
            }, 1500);
        }
    };

    const changeSound = () => {
        if (!sonido) { activateAudio.play(); }
        setSonido(!sonido)
    }

    const isCorrect = (option) => {
        return option === correct;
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    // @SONAR_STOP@
    // sonarignore:start
    const generateUniqueId = () => {
        //NOSONAR
        return Math.random().toString(36).substr(2, 9);//NOSONAR
        //NOSONAR
    };
    // sonarignore:end
    // @SONAR_START@

    return (
        
            <div className='divPreguntas'>
                <div className='questionTime'>
                    <div className='audioQuestion'>
                    <button onClick={() => changeSound()} style={{ border: 'none', background: 'none', padding: 0 }}>
                        <img className='audioImg' src={sonido ? soundOnImage : soundOffImage} alt="Toggle Sound" />
                    </button>
                        <Typography sx={{ display: 'inline-block', textAlign: 'left' }}>Question: {nQuestion}</Typography>
                    </div>
                    { (gameMode !== "infinite" && gameMode !== "threeLife") ?
                    <Typography sx={{ display: 'inline-block', textAlign: 'right' }}> Time: {formatTiempo(segundos)}</Typography>
                    : ""}
                    { gameMode === "threeLife" ?
                    <div> {images} </div> :""}
                </div>
                <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>
                    <Typography variant='h4' sx={{ padding: '10px 40px 30px 40px', color: '#8f95fd', fontSize: '2em' }}>
                        {question}
                    </Typography>
                    <List sx={{ bgcolor: '#333' }} disablePadding>
                        {options.map((option, index) => (
                            <ListItem onClick={() => handleSubmit(option, index)} key={generateUniqueId()}
                                sx={{ bgcolor: getBackgroundColor(option, index) }}>
                                <ListItemButton className={isSelected ? 'disabledButton' : ''}>
                                    <ListItemText sx={{ textAlign: 'center', fontSize: '1em' }} >
                                        {option}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Card>
                <div className='botoneraPreguntas'>
                { gameMode !== "threeLife" ?
                <ListItemButton onClick={isSelected ? () => {
                    setIsSelected(false);
                    fetchQuestion();
                 } : null}
                    sx={{ justifyContent: 'center', marginTop: 2 }}
                    className={isSelected ? '' : 'isNotSelected'} >
                    Next
                </ListItemButton>
                : ""}
                { gameMode === "infinite" ?
                    <ListItemButton onClick={ () => handelInfiniteGameFinish( numberCorrect, numberIncorrect, segundosInfinite, goTo, setGameFinished) }
                        sx={{ color: '#f35858', justifyContent: 'center', marginTop: 2 }}>
                        End Game
                    </ListItemButton>
                : ""}
                </div>
            </div>
        
    );
}

export default Question;
