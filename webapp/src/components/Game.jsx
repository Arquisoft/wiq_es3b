import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'

import React from 'react'
import { useState, useEffect } from 'react'

const N_QUESTIONS = 10

const Question = ({ goTo }) => {
    
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [isSelected, setIsSelected] = useState(false);

    const [correct, setCorrect] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);
    const [nQuestion, setNQuestion] = useState(0);

    const fetchQuestion = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/questions/create');
          const data = await response.json();

          setQuestion(data.question);
          setCorrect(data.correct);
          setOptions(shuffleOptions([data.correct, ...data.incorrects]));

          setSelectedOption(null);
          setIsSelected(false);
          setNQuestion(nQuestion + 1);
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
    
    const shuffleOptions = (options) => {
        let currentIndex = options.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {

            randomIndex = currentIndex - 1;

            temporaryValue = options[currentIndex - 1];
            options[currentIndex - 1] = options[randomIndex];
            options[randomIndex] = temporaryValue;

            currentIndex--;
        }
        return options;
    };
    
    const handleSubmit = (option, index) => {
        
        if (isSelected) return;

        setSelectedOption(option);
        setSelectedIndex(index);
        setIsSelected(true);

        if (isCorrect(option)) {
            setNumberCorrect(numberCorrect+1);
            console.log('Opción correcta seleccionada:', option, ' NC=', numberCorrect);
        } else {
            console.log('Opción incorrecta seleccionada:', option);
        }
    };

    const isCorrect = (option) => {
      
        return option === correct;
    };

    const handleGameFinish = () => {

        if (nQuestion === N_QUESTIONS) {

            // Almacenar datos
            goTo(3);
        }
    }

    useEffect(() => {
        fetchQuestion();
    }, []);

    return(

        <main>
        <div>
        <Typography>Question: {nQuestion}</Typography>
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

export const Game = ({ goTo }) => {

    return (

        <>
            <Question goTo={(x) => goTo(x)}/>
        </>
    )
}
