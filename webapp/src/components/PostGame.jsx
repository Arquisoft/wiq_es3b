import React, { useEffect } from 'react';
import { Card, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useUser } from './UserContext';
import axios from 'axios';

const PostGame = () => {
  const { userData } = useUser();
  const formatTiempo = (segundos) => {
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
  };

  const saveGameData = async () => {
    try {
      const gameData = {
        user: userData._id,
        questions: [], // IDs de las preguntas
        answers: [], // Respuestas del usuario
        totalTime: parseInt(localStorage.getItem("tiempoUsado"))
      };
      await axios.post('http://localhost:8005/saveGame', gameData);
    } catch (error) {
      console.error('Error al guardar los datos de la partida:', error);
    }
  };

  useEffect(() => {
    saveGameData();
  }, []);

  return (
    <main className='preguntas'>
      <div>
        <Typography sx={{ textAlign: 'center', fontSize:'2.2em' }}>Fin del juego</Typography>
        <Card>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow key={"Preguntas acertadas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontSize:'1.3em' }}>Preguntas acertadas</TableCell>
                  <TableCell sx={{ fontSize:'1.3em' }} align="right">{localStorage.getItem("pAcertadas")}</TableCell>
                </TableRow>

                <TableRow key={"Preguntas falladas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontSize:'1.3em' }}>Preguntas falladas</TableCell>
                  <TableCell sx={{ fontSize:'1.3em' }} align="right">{localStorage.getItem("pFalladas")}</TableCell>
                </TableRow>

                <TableRow key={"Tiempo usado"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontSize:'1.3em' }}>Tiempo usado</TableCell>
                  <TableCell sx={{ fontSize:'1.3em' }} align="right">{formatTiempo(localStorage.getItem("tiempoUsado"))}</TableCell>
                </TableRow>

                <TableRow key={"Tiempo restante"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontSize:'1.3em' }}>Tiempo restante</TableCell>
                  <TableCell sx={{ fontSize:'1.3em' }} align="right">{formatTiempo(localStorage.getItem("tiempoRestante"))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </div>
    </main>
  );
};

export default PostGame;