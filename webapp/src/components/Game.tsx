import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'

import { useQuestionsStore } from '../questions/questions.ts'
import { type Question as QuestionType } from '../questions/questionType'
import React from 'react'

const Question = ({ info }: { info: QuestionType }) => {
    const selectAnswer = useQuestionsStore(state => state.selectAnswer)
  
    const createHandleClick = (answer: string) => () => {
      selectAnswer(info.id, answer)
    }
    
    return(

        <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>

            <Typography variant='h4' paddingBottom={"20px"}>
                { info.question }
            </Typography>

            <List sx={{ bgcolor: '#333'}} disablePadding>
                <ListItem>
                    <ListItemButton>
                        <ListItemText sx={{textAlign: 'center'}}>
                            Londres
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemText sx={{textAlign: 'center'}}>
                            Madrid
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemText sx={{textAlign: 'center'}}>
                            Paris
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemText sx={{textAlign: 'center'}}>
                            Roma
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>

        </Card>
    )
}

export const Game = ({ goTo }) => {

    const questions = useQuestionsStore(state => state.questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const questionInfo = questions[currentQuestion]

    return (

        <>
            <Typography variant='h3' paddingBottom={"30px"}>
                React Quiz
            </Typography>
            <Question info={questionInfo}/>
            <ListItemButton onClick={ () => goTo(1) }>
                <ListItemText sx={{textAlign: 'center'}}>
                    Volver al menú
                </ListItemText>
            </ListItemButton>
        </>
    )
}
