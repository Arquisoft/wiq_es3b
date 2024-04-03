import React, { useState, useEffect, useContext } from 'react';
import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { SessionContext } from '../SessionContext';
import correctSound from '../audio/correct.mp3';
import incorrectSound from '../audio/incorrect.mp3';
import soundOnImage from '../assets/sonidoON.png';
import soundOffImage from '../assets/sonidoOFF.png';
import PropTypes from 'prop-types';

export const N_QUESTIONS = 10;

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

export const handleGameFinish = (nQuestion, numberCorrect, segundos, MAX_TIME, sonido, setQuestions, setAnswers) => {
    if (nQuestion === N_QUESTIONS) {
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
        finishByQuestions(segundos, MAX_TIME);
    }
    if (segundos === 1) {
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
        finishByTime(sonido);
    }

    // Guardar las preguntas y respuestas en el localStorage
    const storedQuestions = [];
    const storedAnswers = [];
    for (let i = 0; i < N_QUESTIONS; i++) {
        storedQuestions.push(localStorage.getItem(`question_${i}`));
        storedAnswers.push({
            response: localStorage.getItem(`answer_${i}`),
            isCorrect: localStorage.getItem(`isCorrect_${i}`) === "true"
        });
    }
    setQuestions(storedQuestions);
    setAnswers(storedAnswers);
};

const Question = ({ goTo, setGameFinished }) => {
    localStorage.setItem("pAcertadas", 0);

    const { sessionData } = useContext(SessionContext);

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
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

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
            
            // Incrementar nQuestion después de obtener la pregunta
            setNQuestion((prevNQuestion) => prevNQuestion + 1);
    
            setQuestion(data.question);
            setCorrect(data.correct);
            setOptions(shuffleOptions([data.correct, ...data.incorrects]));
    
            setSelectedOption(null);
            setIsSelected(false);
            handleGameFinish(nQuestion, numberCorrect, segundos, MAX_TIME, sonido, setQuestions, setAnswers);
            if (nQuestion === N_QUESTIONS) { setGameFinished(true); goTo(1);}
            if (segundos === 1) {setGameFinished(true); goTo(1);}
    
            // Guardar la pregunta actual en el localStorage
            localStorage.setItem(`question_${nQuestion}`, data.question);
            localStorage.setItem(`question_id_${nQuestion}`, data.questionId);
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
        return options.sort(() => Math.random() - 0.5);
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
        }

        // Guardar la respuesta actual en el localStorage
        localStorage.setItem(`answer_${nQuestion}`, option);
        localStorage.setItem(`isCorrect_${nQuestion}`, isCorrect(option));
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
        return Math.random().toString(36).substr(2, 9);
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
