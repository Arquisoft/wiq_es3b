// Question.js
import React, { useState, useEffect, useContext } from 'react';
import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { SessionContext } from '../SessionContext';
import correctSound from '../audio/correct.mp3';
import incorrectSound from '../audio/incorrect.mp3';
import soundOnImage from '../assets/sonidoON.png';
import soundOffImage from '../assets/sonidoOFF.png';
import PropTypes from 'prop-types';


const N_QUESTIONS = 10;
const MAX_TIME = 120;

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

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
        segundos, MAX_TIME, sonido, goTo, setGameFinished) => {
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

export const handleOOLGameFinish = (nQuestion, time, goTo, setGameFinished) => {
    localStorage.setItem("pAcertadas", nQuestion - 1);
    localStorage.setItem("tiempoUsado", new Date() - time);
    setGameFinished(true); goTo(1);
};

export const handelInfiniteGameFinish = (numberCorrect, numberIncorrect, time, goTo, setGameFinished) => {
    localStorage.setItem("pAcertadas", numberCorrect);
    localStorage.setItem("pFalladas", numberIncorrect);
    localStorage.setItem("tiempoUsado", new Date() - time);
    setGameFinished(true); goTo(1);
};

const Question = ({ goTo, setGameFinished, gameMode }) => {

    localStorage.setItem("pAcertadas", 0);
    localStorage.setItem("pFalladas", 0);
    useContext(SessionContext);

    var initTime = null;
    if (gameMode === "onlyOneLife" || gameMode === "infinite") { initTime = new Date(); }

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
    const [sonido, setSonido] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSegundos(segundos => {
                if (segundos === 1) { clearInterval(intervalId); finishByTime(sonido); setGameFinished(true); goTo(1); }
                return segundos - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formatTiempo = (segundos) => {
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
    };

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`${gatewayUrl}/api/questions/create`, {
                method: 'GET'
            });
            const data = await response.json();

            setQuestion(data.question);
            setCorrect(data.correct);
            setOptions(shuffleOptions([data.correct, ...data.incorrects]));

            setSelectedOption(null);
            setIsSelected(false);
            setNQuestion((prevNQuestion) => prevNQuestion + 1);
            if (gameMode === "classic") {
                handleClassicGameFinish(nQuestion, numberCorrect, numberIncorrect, segundos, 
                            MAX_TIME, sonido, goTo, setGameFinished);
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
        } else if (sonido) { 
            incorrectAudio.play();
            setNumberIncorrect(numberIncorrect + 1);
            setTimeout(() => {
                if (gameMode === 'onlyOneLife') {
                    handleOOLGameFinish(nQuestion, initTime, goTo, setGameFinished);
                }
            }, 1000);
        }
    };

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
        <main className='preguntas'>
            <div className='divPreguntas'>
                <div className='questionTime'>
                    <div className='audioQuestion'>
                    <button onClick={() => setSonido(!sonido)} style={{ border: 'none', background: 'none', padding: 0 }}>
                        <img className='audioImg' src={sonido ? soundOnImage : soundOffImage} alt="Toggle Sound" />
                    </button>
                        <Typography sx={{ display: 'inline-block', textAlign: 'left' }}>Question: {nQuestion}</Typography>
                    </div>
                    { (gameMode !== "infinite" && gameMode !== "onlyOneLife") ?
                    <Typography sx={{ display: 'inline-block', textAlign: 'right' }}> Time: {formatTiempo(segundos)}</Typography>
                    : ""}
                </div>
                <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>
                    <Typography variant='h4' sx={{ padding: '10px 40px 30px 40px', color: '#8f95fd' }}>
                        {question}
                    </Typography>
                    <List sx={{ bgcolor: '#333' }} disablePadding>
                        {options.map((option, index) => (
                            <ListItem onClick={() => handleSubmit(option, index)} key={generateUniqueId()}
                                sx={{ bgcolor: getBackgroundColor(option, index) }}>
                                <ListItemButton className={isSelected ? 'disabledButton' : ''}>
                                    <ListItemText sx={{ textAlign: 'center' }} >
                                        {option}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Card>
                <div className='botoneraPreguntas'>
                <ListItemButton onClick={isSelected ? () => fetchQuestion() : null}
                    sx={{ justifyContent: 'center', marginTop: 2 }}
                    className={isSelected ? '' : 'isNotSelected'} >
                    Next
                </ListItemButton>
                { gameMode === "infinite" ?
                    <ListItemButton onClick={ () => handelInfiniteGameFinish( numberCorrect, numberIncorrect, initTime, goTo, setGameFinished) }
                        sx={{ color: '#f35858', justifyContent: 'center', marginTop: 2 }}>
                        End Game
                    </ListItemButton>
                : ""}
                </div>
            </div>
        </main>
    );
}

Question.propTypes = {
    goTo: PropTypes.func.isRequired, // Asegura que goTo sea una función y es requerida
    setGameFinished: PropTypes.func.isRequired,
};

export default Question;
