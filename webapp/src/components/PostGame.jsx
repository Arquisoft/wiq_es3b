import React, { useEffect, useContext } from 'react';
import { Card, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { SessionContext } from '../SessionContext';

const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

export const PostGame = ({ gameMode }) => {
    const { sessionData } = useContext(SessionContext);

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
        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    };

    useEffect(() => {
        if (sessionData && sessionData.userId) {
            saveGame();
        }
    }, [sessionData]); // Ejecuta saveGame cada vez que sessionData cambie

    return (
        <div>
            <Typography sx={{ textAlign: 'center', fontSize:'2em', margin:'2em 0 0.3em 0 !important' }}>Game Over</Typography>
            <Card>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
          
                        <TableRow key={"Preguntas acertadas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Correct answers</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{localStorage.getItem("pAcertadas")}</TableCell>
                        </TableRow>

                        { gameMode !== "threeLife" ?
                        <TableRow key={"Preguntas falladas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Incorrect answers</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{localStorage.getItem("pFalladas")}</TableCell>
                        </TableRow>
                        : ""}
                        <TableRow key={"Tiempo usado"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Elapsed time</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{formatTiempo(localStorage.getItem("tiempoUsado"))}</TableCell>
                        </TableRow>

                        { gameMode === "classic" || gameMode === "category" ?
                        <TableRow key={"Tiempo restante"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Time remaining</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{formatTiempo(localStorage.getItem("tiempoRestante"))}</TableCell>
                        </TableRow>
                        : ""}
          
                    </TableBody>
                </Table>
            </TableContainer>
            </Card>
        </div>
    )
}

export const formatTiempo = (segundos) => {
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
};

export default PostGame;