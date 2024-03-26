import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { SessionContext } from '../SessionContext';

import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { PostGame } from './PostGame'

import correctSound from '../audio/correct.mp3';
import incorrectSound from '../audio/incorrect.mp3';
import soundOnImage from '../assets/sonidoON.png';
import soundOffImage from '../assets/sonidoOFF.png';

const N_QUESTIONS = 10
const MAX_TIME = 120;

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

const gatewayUrl=process.env.REACT_APP_API_ENDPOINT||"http://localhost:8000"

const Question = ({ goTo, setGameFinished }) => {
    
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

    useEffect(() => {

        const intervalId = setInterval(() => {
            setSegundos(segundos => {
                if (segundos === 1) { clearInterval(intervalId); finishByTime() }
                return segundos - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    // eslint-disable-next-line
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
            handleGameFinish();
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
            setNumberCorrect(numberCorrect+1);
            if (sonido) { correctAudio.play(); }
        } else {
            if (sonido) { incorrectAudio.play(); }
        }
    };

    const isCorrect = (option) => {
      
        return option === correct;
    };

    const handleGameFinish = () => {

        if (nQuestion === N_QUESTIONS) { 
            localStorage.setItem("pAcertadas", numberCorrect);
            localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
            finishByQuestions();
        }
        if (segundos === 1) {
            localStorage.setItem("pAcertadas", numberCorrect);
            localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
            finishByTime();
        }
    }

    const finishByQuestions = () => {
        // Almacenar datos
        localStorage.setItem("tiempoUsado", MAX_TIME - segundos);
        localStorage.setItem("tiempoRestante", segundos)

        setGameFinished(true);
        goTo(1);
    }

    const finishByTime = () => {
        // Almacenar datos
        localStorage.setItem("tiempoUsado", MAX_TIME);
        localStorage.setItem("tiempoRestante", 0);

        if (sonido) { incorrectAudio.play(); }
        setGameFinished(true);
        goTo(1);
    }

    useEffect(() => {
        fetchQuestion();
    // eslint-disable-next-line
    }, []);

    return(

        <main className='preguntas'>
        <div>
        <div className='questionTime'>
            <div className='audioQuestion'>
            <img className='audioImg' src={sonido ? soundOnImage : soundOffImage} onClick={() => setSonido(!sonido)} />
            <Typography sx={{ display:'inline-block', textAlign:'left'}} >Question: {nQuestion}</Typography>
            </div>
        <Typography sx={{ display:'inline-block', textAlign:'right'}}>Time: {formatTiempo(segundos)}</Typography>
        </div>
        <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>

            <Typography variant='h4' sx={{ padding:'10px 40px 30px 40px' }}>
                {question}
            </Typography>

            <List sx={{ bgcolor: '#333'}} disablePadding>
                {options.map((option, index) => (
                    <ListItem onClick={ () => handleSubmit(option, index) } key={index}
                                sx={{ bgcolor: getBackgroundColor(option, index)}}>
                        <ListItemButton className={isSelected ? 'disabledButton' : ''}>
                            <ListItemText sx={{textAlign: 'center'}} >
                                {option}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Card>
        <ListItemButton onClick={ isSelected ? () => fetchQuestion() : null }
                    sx={{ justifyContent: 'center' , marginTop: 2}} 
                    className={isSelected ? '' : 'isNotSelected'} >
            Next
        </ListItemButton>
        </div>
        </main>
    )
}

export const Game = () => {
    const [gameState, setGameState] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);

    const goTo = (parameter) => {
        setGameState(parameter);
    };

    useEffect(() => {
        if (gameFinished) {
            setGameState(1); // Cambia el estado después de que Question termine de renderizarse
        }
    }, [gameFinished]);

    return (
        <>
            {gameState === 0 && <Question goTo={(x) => goTo(x)} setGameFinished={setGameFinished} />}
            {gameState === 1 && <PostGame />}
        </>
    );
};
