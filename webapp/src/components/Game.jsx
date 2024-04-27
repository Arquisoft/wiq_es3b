import React, { useState, useEffect } from 'react';
import { PostGame } from './PostGame';
import Question from './Question';
import { Select, MenuItem, FormControl, InputLabel, Typography, TextField, Snackbar } from '@mui/material';
import '../css/game.css';
import { FormattedMessage } from 'react-intl';

export const Game = ({ gameMode, locale, daltonicMode }) => {

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
        setCustomSettings(prevSettings => ({ ...prevSettings, category:category }));
        setRestart(!restart);
        goTo(0);
    }

    const [customSettings, setCustomSettings] = useState({
        
        gMode: gMode,
        maxTime: 3,
        numberQ: 10,
        category: category
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
            <main className='preguntas appearEffectFast'>
                { gameState === 0 && gMode === "category" ?
                    <Typography sx={{ fontSize:'1.6em', marginBottom:'0.3em !important', paddingTop:'1em', textAlign:'center' }}>
                        <FormattedMessage id="restartCategory" /></Typography>
                :""}
                { gameState === 1 && gMode === "category" ?
                    <Typography sx={{ fontSize:'1.6em', marginBottom:'0.3em !important' }}>
                        <FormattedMessage id="chooseCategory" /></Typography>
                :""}

            { gMode === "category" &&
                <div className='questionCategory'>
                    <button className={category === "general" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("general")}> <FormattedMessage id="allCategories" /></button>
                    <button className={category === "art" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("art")}> <FormattedMessage id="art" /></button>
                    <button className={category === "sports" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("sports")}> <FormattedMessage id="sports" /></button>
                    <button className={category === "entertainment" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("entertainment")}> <FormattedMessage id="entertainment" /></button>
                    <button className={category === "geography" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("geography")}> <FormattedMessage id="geography" /></button>
                    <button className={category === "planets" ? 'questionCategoryMarked categoryBtn' : 'categoryBtn'}
                        onClick={() => changeCategory("planets")}> <FormattedMessage id="planets" /></button>
                </div> }

            { gMode === "custom" &&
                <div className='customOptions'>
                    <h2 className="tituloCustom">&lt;!-- <FormattedMessage id="selectCustom" /> --&gt;</h2>
                    <TextField name="maxTime" margin="normal" fullWidth label={<FormattedMessage id="maxTime" />}
                        onChange={(e) => setMaxTime(e.target.value)}
                    />
                    <TextField name="numberQ" margin="normal" fullWidth label={<FormattedMessage id="numQuestions" />}
                        onChange={(e) => setNumberQ(e.target.value)} sx={{ marginTop:'0.2em' }}
                    />
                    <FormControl fullWidth margin="normal" sx={{ backgroundColor:'#080808', marginTop:'0.2em' }}>
                        <InputLabel id="category-label"><FormattedMessage id="categoryOpt" /></InputLabel>
                        <Select labelId="category-label" id="category-select" value={customSettings.category} label="Category"
                            onChange={(e) => setCustomSettings(prevSettings => ({ ...prevSettings, category: e.target.value }))}
                            >
                            <MenuItem value="general"><FormattedMessage id="allCategories" /></MenuItem>
                            <MenuItem value="art"><FormattedMessage id="art" /></MenuItem>
                            <MenuItem value="sports"><FormattedMessage id="sports" /></MenuItem>
                            <MenuItem value="entertainment"><FormattedMessage id="entertainment" /></MenuItem>
                            <MenuItem value="geography"><FormattedMessage id="geography" /></MenuItem>
                            <MenuItem value="planets"><FormattedMessage id="planets" /></MenuItem>
                        </Select>
                    </FormControl>
                    <div className='startCustom'>
                        <button className="btn" onClick={() => startCustomGame()}><FormattedMessage id="startGame" tagName="span" /></button>
                    </div>
                </div> }    

            { gameState === 0 && gMode !== "custom" && <Question goTo={(x) => goTo(x)} setGameFinished={setGameFinished} 
                settings={customSettings} key={restart.toString()} restart={restart} locale={locale} daltonicMode={daltonicMode} /> }
            { gameState === 1 && <PostGame gameMode={gMode}/> }
            </main>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={<FormattedMessage id="invalidCustom"/>}
            />
        </>
    );
};
