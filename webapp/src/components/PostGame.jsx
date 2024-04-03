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
import { N_QUESTIONS } from './Question'

const PostGame = () => {
    const { sessionData } = useContext(SessionContext);

    // Función para guardar el juego en la BD
    const saveGame = async () => {
        try {
            // Obtener las preguntas y respuestas del localStorage
            const storedQuestions = [];
            const storedAnswers = [];
            for (let i = 0; i < N_QUESTIONS; i++) {
                storedQuestions.push(localStorage.getItem(`question_${i}`));
                storedAnswers.push({
                    response: localStorage.getItem(`answer_${i}`),
                    isCorrect: localStorage.getItem(`isCorrect_${i}`) === "true"
                });
            }

            // Guardar el juego en la base de datos
            const response = await axios.post('http://localhost:8005/addgame', {
                user: sessionData.userId,
                questions: storedQuestions,
                answers: storedAnswers,
                totalTime: localStorage.getItem("tiempoUsado")
            });
            console.log('Juego guardado exitosamente:', response.data);
        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    };

    useEffect(() => {
        saveGame();
    }, [sessionData]); // Ejecuta saveGame cada vez que sessionData cambie

    const formatTiempo = (segundos) => {
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
    };

    return (
        <main className='preguntas'>
            <div>
                <Typography sx={{ textAlign: 'center', fontSize: '2.2em' }}>Fin del juego</Typography>
                <Card>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableBody>
                                <TableRow key={"Preguntas acertadas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontSize: '1.3em' }}>Preguntas acertadas</TableCell>
                                    <TableCell sx={{ fontSize: '1.3em' }} align="right">{localStorage.getItem("pAcertadas")}</TableCell>
                                </TableRow>

                                <TableRow key={"Preguntas falladas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontSize: '1.3em' }}>Preguntas falladas</TableCell>
                                    <TableCell sx={{ fontSize: '1.3em' }} align="right">{localStorage.getItem("pFalladas")}</TableCell>
                                </TableRow>

                                <TableRow key={"Tiempo usado"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontSize: '1.3em' }}>Tiempo usado</TableCell>
                                    <TableCell sx={{ fontSize: '1.3em' }} align="right">{formatTiempo(localStorage.getItem("tiempoUsado"))}</TableCell>
                                </TableRow>

                                <TableRow key={"Tiempo restante"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontSize: '1.3em' }}>Tiempo restante</TableCell>
                                    <TableCell sx={{ fontSize: '1.3em' }} align="right">{formatTiempo(localStorage.getItem("tiempoRestante"))}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </div>
        </main>
    )
};

export default PostGame;