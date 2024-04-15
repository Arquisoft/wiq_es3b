import React, { useState, useEffect } from 'react';
import { PostGame } from './PostGame';
import Question from './Question';
import { Select, MenuItem, FormControl, InputLabel, Typography, TextField, Snackbar } from '@mui/material';
import '../css/game.css';

export const Game = ({ gameMode }) => {

    const [gameState, setGameState] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);

    const [category, setCategory] = useState("general");
    const [restart, setRestart] = useState(false);

    const [gMode, setGameMode] = useState(gameMode);

    const [maxTime, setMaxTime] = useState('');
    const [numberQ, setNumberQ] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const changeCategory = (category) => {
        setCategory(category);
        setRestart(!restart);
        goTo(0);
    }

    const [customSettings, setCustomSettings] = useState({
        
        gMode: gMode,
        maxTime: 3,
        numberQ: 10,
        category: "general"
    });

    const startCustomGame = () => {

        if (!validateInputs()) {
            setSnackbarOpen(true);
            return;
        }
        setCustomSettings(prevSettings => ({ ...prevSettings, maxTime:maxTime , numberQ:numberQ }))
        setGameMode("customMode");
    }

    const validateInputs = () => {
        const maxTimeInt = parseInt(maxTime);
        const numberQInt = parseInt(numberQ);
        return Number.isInteger(maxTimeInt) && Number.isInteger(numberQInt) && maxTimeInt > 0 && numberQInt > 0;
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
            <main className='preguntas'>
                { gameState === 0 && gMode === "category" ?
                    <Typography sx={{ fontSize:'1.6em', marginBottom:'0.3em !important', paddingTop:'1em', textAlign:'center' }}>
                        Restart game with a new category</Typography>
                :""}
                { gameState === 1 && gMode === "category" ?
                    <Typography sx={{ fontSize:'1.6em', marginBottom:'0.3em !important' }}>
                        Choose a category for a new game</Typography>
                :""}

            { gMode === "category" &&
                <div className='questionCategory'>
                    <button className={category === "general" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("general")}> All Categories</button>
                    <button className={category === "art" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("art")}> Art</button>
                    <button className={category === "sports" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("sports")}> Sports</button>
                    <button className={category === "entertainment" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("entertainment")}> Entertainment</button>
                    <button className={category === "geography" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("geography")}> Geography</button>
                    <button className={category === "planets" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("planets")}> Planets</button>
                </div> }

            { gMode === "custom" &&
                <div className='customOptions'>
                    <h2 className="tituloCustom">&lt;!-- Select custom Settings --&gt;</h2>
                    <TextField name="maxTime" margin="normal" fullWidth label="Max Time (minutes)"
                        onChange={(e) => setMaxTime(e.target.value)}
                    />
                    <TextField name="numberQ" margin="normal" fullWidth label="Number of Questions"
                        onChange={(e) => setNumberQ(e.target.value)} sx={{ marginTop:'0.2em' }}
                    />
                    <FormControl fullWidth margin="normal" sx={{ backgroundColor:'#080808', marginTop:'0.2em' }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select labelId="category-label" id="category-select" value={customSettings.category} label="Category"
                            onChange={(e) => setCustomSettings(prevSettings => ({ ...prevSettings, category: e.target.value }))}
                            >
                            <MenuItem value="general">General</MenuItem>
                            <MenuItem value="art">Art</MenuItem>
                            <MenuItem value="sports">Sports</MenuItem>
                            <MenuItem value="entertainment">Entertainment</MenuItem>
                            <MenuItem value="geography">Geography</MenuItem>
                            <MenuItem value="planets">Planets</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='startCustom'>
                        <button className="btn" onClick={() => startCustomGame()}><span>Start Game</span></button>
                    </div>
                </div> }    

            { gameState === 0 && gMode !== "custom" && <Question goTo={(x) => goTo(x)} setGameFinished={setGameFinished} 
                settings={customSettings} key={restart.toString()} restart={restart}/> }
            { gameState === 1 && <PostGame gameMode={gMode}/> }
            </main>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Please enter valid integers greater than 0 for both Max Time and Number of Questions."
            />
        </>
    );
};
