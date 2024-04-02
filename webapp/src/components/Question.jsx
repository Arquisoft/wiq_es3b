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

export const handleGameFinish = (nQuestion, numberCorrect, segundos, MAX_TIME, sonido, token) => {
    let finish = false;
    if (nQuestion === N_QUESTIONS) {
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
        finishByQuestions(segundos, MAX_TIME);
        finish = true;
    }
    if (segundos === 1) {
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
        finishByTime(sonido);
        finish = true;
    }
    if(finish){
        fetch(`${gatewayUrl}/addgame`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correctAnswers: localStorage.getItem("pAcertadas"),
                incorrectAnswers: localStorage.getItem("pFalladas"),
                usedTime: localStorage.getItem("tiempoUsado"),
                remainingTime: localStorage.getItem("tiempoRestante"),
                questions: localStorage.getItem("questions"),
                answers: localStorage.getItem("answers"),
                category: localStorage.getItem("category"),
                difficulty: localStorage.getItem("difficulty"),
                date: new Date()
            })
        })
        .then(response => response)
        .catch(error => {
            console.error('Error adding game:', error);
        });
        //reset
        localStorage.setItem("answers", []);
        localStorage.setItem("questions", []);
    }

};

const Question = ({ goTo, setGameFinished }) => {
    localStorage.setItem("pAcertadas", 0);

    const {sessionData}=useContext(SessionContext);
    const userToken = sessionData ? sessionData.token : '';

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [correct, setCorrect] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);
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
            handleGameFinish(nQuestion, numberCorrect, segundos, MAX_TIME, sonido, userToken);
            if (nQuestion === N_QUESTIONS) { setGameFinished(true); goTo(1);}
            if (segundos === 1) {setGameFinished(true); goTo(1);}
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
        const storedQuestions = localStorage.getItem("questions") ? JSON.parse(localStorage.getItem("questions")) : [];
        const incorrects = options.filter((opt) => opt !== correct);
        const newQuestion = { question, correct, incorrects };
        const updatedQuestions = [...storedQuestions, newQuestion];
        localStorage.setItem("questions", JSON.stringify(updatedQuestions)); 
        const storedAnswers = localStorage.getItem("answers") ? JSON.parse(localStorage.getItem("answers")) : [];
        const answer = { option: option, isCorrect: isCorrect(option) };
        localStorage.setItem("answers", JSON.stringify([...storedAnswers, answer]));
        setSelectedOption(option);
        setSelectedIndex(index);
        setIsSelected(true);

        if (isCorrect(option)) {
            setNumberCorrect(numberCorrect + 1);
            if (sonido) { correctAudio.play(); }
        } else if (sonido) { 
            incorrectAudio.play(); 
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
            <div>
                <div className='questionTime'>
                    <div className='audioQuestion'>
                    <button onClick={() => setSonido(!sonido)} style={{ border: 'none', background: 'none', padding: 0 }}>
                        <img className='audioImg' src={sonido ? soundOnImage : soundOffImage} alt="Toggle Sound" />
                    </button>
                        <Typography sx={{ display: 'inline-block', textAlign: 'left' }}>Question: {nQuestion}</Typography>
                    </div>
                    <Typography sx={{ display: 'inline-block', textAlign: 'right' }}>Time: {formatTiempo(segundos)}</Typography>
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
                <ListItemButton onClick={isSelected ? () => fetchQuestion() : null}
                    sx={{ justifyContent: 'center', marginTop: 2 }}
                    className={isSelected ? '' : 'isNotSelected'} >
                    Next
                </ListItemButton>
            </div>
        </main>
    );
}

Question.propTypes = {
    goTo: PropTypes.func.isRequired, // Asegura que goTo sea una función y es requerida
    setGameFinished: PropTypes.func.isRequired,
};

export default Question;
