import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'

import React from 'react'
import { useState, useEffect } from 'react'
import { PostGame } from './PostGame'

const N_QUESTIONS = 10
const MAX_TIME = 600;

const Question = ({ goTo, setGameFinished }) => {
    
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [isSelected, setIsSelected] = useState(false);

    const [correct, setCorrect] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);
    const [nQuestion, setNQuestion] = useState(0);

    const [segundos, setSegundos] = useState(MAX_TIME);
  
    useEffect(() => {

        const intervalId = setInterval(() => {
            setSegundos(segundos => {
                if (segundos === 1) { clearInterval(intervalId); finish() }
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
            const response = await fetch('http://localhost:8000/api/questions/create');
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
        }
    };

    const isCorrect = (option) => {
      
        return option === correct;
    };

    const handleGameFinish = () => {

        if (nQuestion === N_QUESTIONS) { finish() }
        if (segundos === 1) { setSegundos(0); finish() }
    }

    const finish = () => {
        // Almacenar datos
        localStorage.setItem("pAcertadas", numberCorrect);
        localStorage.setItem("pFalladas", N_QUESTIONS - numberCorrect);
        localStorage.setItem("tiempoUsado", MAX_TIME - segundos);
        localStorage.setItem("tiempoRestante", segundos);

        //localStorage.setItem("questionsAnswered", )
        //localStorage.setItem("answers", )

        setGameFinished(true);
        goTo(1);
    }

    useEffect(() => {
        fetchQuestion();
    }, []);

    return(

        <main className='preguntas'>
        <div>
        <div className='questionTime'>
        <Typography sx={{ display:'inline-block', textAlign:'left'}} >Question: {nQuestion}</Typography>
        <Typography sx={{ display:'inline-block', textAlign:'right'}}>Time: {formatTiempo(segundos)}</Typography>
        </div>
        <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>

            <Typography variant='h4' paddingBottom={"20px"}>
                {question}
            </Typography>

            <List sx={{ bgcolor: '#333'}} disablePadding>
                {options.map((option, index) => (
                    <ListItem onClick={ () => handleSubmit(option, index) } key={index} sx={{ bgcolor: getBackgroundColor(option, index)}}>
                        <ListItemButton>
                            <ListItemText sx={{textAlign: 'center'}}>
                                {option}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Card>
        { isSelected ? (
                
            <ListItemButton onClick={ () => fetchQuestion() } sx={{ justifyContent: 'center' , marginTop: 2}} >
                Next
            </ListItemButton>
            ) : (null)
        }
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
