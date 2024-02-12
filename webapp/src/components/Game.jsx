import { Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import reactLogo from '../assets/react.svg'

const Question = () => {
    return(

        <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left' }}>

            <Typography variant='h4' paddingBottom={"20px"}>
                ¿Cuál es la capital de España?
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

    return (

        <>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            <Typography variant='h3' paddingBottom={"30px"}>
                React Quiz
            </Typography>
            <Question />
            <ListItemButton onClick={ () => goTo(0) }>
                <ListItemText sx={{textAlign: 'center'}}>
                    Volver al menú
                </ListItemText>
            </ListItemButton>
        </>
    )
}
