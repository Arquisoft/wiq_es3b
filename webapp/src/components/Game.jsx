import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { green } from '@mui/material/colors';

import React from 'react'
import { useState, useEffect } from 'react'

const Question = () => {
    
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();

    const [correct, setCorrect] = useState('');
    const [numberCorrect, setNumberCorrect] = useState(0);

    const fetchQuestion = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/questions/create');
          const data = await response.json();
          setQuestion(data.question);
          setCorrect(data.correct);
          setOptions(shuffleOptions([data.correct, ...data.incorrects]));
          setSelected(null);
        } catch (error) {
          console.error('Error fetching question:', error);
        }
    };

    const getBackgroundColor = (option, index) => {

        if (selected == null) return 'transparent';

        if (!isCorrect(option) && index == selectedIndex) return 'red';

        if (isCorrect(option)) return 'green';
    };
    
    const shuffleOptions = (options) => {
        return options.sort(() => Math.random() - 0.5);
    };
    
    const handleSubmit = (option, index) => {
        
        setSelected(option);
        setSelectedIndex(index);
        if (isCorrect(option)) {
            setNumberCorrect(numberCorrect+1);
            console.log('Opción correcta seleccionada:', option, ' NC=', numberCorrect);
        } else {
            console.log('Opción incorrecta seleccionada:', option);
        }
        //fetchQuestion();
    };

    const isCorrect = (option) => {
      
        return option == correct;
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    return(

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
    )
}

export const Game = ({ goTo }) => {

    return (

        <>
            <Typography variant='h3' paddingBottom={"30px"}>
                React Quiz
            </Typography>
            <Question />
            <ListItemButton onClick={ () => goTo(1) }>
                <ListItemText sx={{textAlign: 'center'}}>
                    Volver al menú
                </ListItemText>
            </ListItemButton>
        </>
    )
}
