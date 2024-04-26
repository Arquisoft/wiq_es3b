import React, { useState, useEffect, useContext } from 'react';
import { Card, Typography, Snackbar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { SessionContext } from '../SessionContext';
import { FormattedMessage } from 'react-intl';

const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";


export const PostGame = ({ gameMode }) => {
    const { sessionData } = useContext(SessionContext);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState('');

    // Función para guardar el juego en la BD
    const saveGame = async () => {
        try {
            // Guardar el juego en la base de datos
            const response = await axios.post(`${gatewayUrl}/addgame`, {
                user: sessionData.userId,
                pAcertadas: localStorage.getItem("pAcertadas"),
                pFalladas: localStorage.getItem("pFalladas"),
                totalTime: localStorage.getItem("tiempoUsado"),
                gameMode: gameMode,
            }, {
                headers: {
                    Authorization: `Bearer ${sessionData.token}`
                }
            });
            console.log('Juego guardado exitosamente:', response.data);
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error al guardar el juego:', error);
            setError(error);
        }
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };


    useEffect(() => {
        if (sessionData && sessionData.userId) {
            saveGame();
        }
    // eslint-disable-next-line
    }, []);

    return (
        <div className='appearEffectFast'>
            <Typography sx={{ textAlign: 'center', fontSize:'2em', margin:'0 0 0.3em 0 !important', color:'#8f95fd' }}>Game Over</Typography>
            <Card>
            <TableContainer component={Paper}>
                <Table className='tablePost' sx={{ minWidth: '30vw' }} aria-label="simple table">
                    <TableBody>
          
                        <TableRow key={"Preguntas acertadas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="correctA" /></TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{localStorage.getItem("pAcertadas")}</TableCell>
                        </TableRow>

                        { gameMode !== "threeLife" ?
                        <TableRow key={"Preguntas falladas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="incorrectA" /></TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{localStorage.getItem("pFalladas")}</TableCell>
                        </TableRow>
                        : ""}
                        <TableRow key={"Tiempo usado"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="elapseTime" /></TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{formatTiempo(localStorage.getItem("tiempoUsado"))}</TableCell>
                        </TableRow>

                        { gameMode === "classic" || gameMode === "category" ?
                        <TableRow key={"Tiempo restante"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="timeRemaining" /></TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{formatTiempo(localStorage.getItem("tiempoRestante"))}</TableCell>
                        </TableRow>
                        : ""}
          
                    </TableBody>
                </Table>
            </TableContainer>
            </Card>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={<FormattedMessage id="gameSaved" />} />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={<FormattedMessage id="errorAddingGame" />} />
          )}
        </div>
    )
}

export const formatTiempo = (segundos) => {
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
};

export default PostGame;