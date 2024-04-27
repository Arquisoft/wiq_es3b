import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/participation.css';
import { SessionContext } from '../SessionContext';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

export const Participation = ({ goTo }) => {
  const { sessionData } = useContext(SessionContext);
  const [participationData, setParticipationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realizar la solicitud al servidor para obtener los datos de participación
    const fetchData = async () => {
      try { 
        const response = await axios.get(`${gatewayUrl}/getParticipation/${sessionData.userId}`);
        if (response.status === 204) {
          setLoading(false);
        } else {
          setParticipationData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener los datos de participación:', error);
        setLoading(false);
      }
    };

    if (sessionData) {
      fetchData();
    }
  }, [sessionData]);

  return (
    <main className="Participation-container">
      <div>
        <Typography id="participationTitle" sx={{ textAlign: 'center', fontSize:'2em', margin:'0 0 0.3em 0 !important', color:'#8f95fd' }}>
          <FormattedMessage id="participationTitle" />
        </Typography>

        {loading ? (
          <p><FormattedMessage id={participationData ? "loadingData" : "noParticipationData"} className="Participation-text"/></p>
        ) : (
          participationData !== null ? (
            <div className="Participation-text">
              <TableContainer component={Paper} className='tableContainer'>
                <Table className='tablePost' sx={{ minWidth: '30vw' }} aria-label="simple table">
                  <TableBody>
                    <TableRow key={"Total Games"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="totalGames" /></TableCell>
                      <TableCell sx={{ fontSize:'1.2em' }} align="right">{participationData.totalGames}</TableCell>
                    </TableRow>
                    <TableRow key={"Correct Answers"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="correctAnswers" /></TableCell>
                      <TableCell sx={{ fontSize:'1.2em' }} align="right">{participationData.correctAnswers}</TableCell>
                    </TableRow>
                    <TableRow key={"Incorrect Answers"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="incorrectAnswers" /></TableCell>
                      <TableCell sx={{ fontSize:'1.2em' }} align="right">{participationData.incorrectAnswers}</TableCell>
                    </TableRow>
                    <TableRow key={"Total Time"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontSize:'1.2em' }}><FormattedMessage id="totalTime" /></TableCell>
                      <TableCell sx={{ fontSize:'1.2em' }} align="right">{participationData.totalTime} <FormattedMessage id="seconds" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <div data-testid="pie-chart" className="recharts-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart width={400} height={400}>
                  <Pie
                    data={[
                      { name: <FormattedMessage id="correctAnswers" />, value: participationData.correctAnswers },
                      { name: <FormattedMessage id="incorrectAnswers" />, value: participationData.incorrectAnswers }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    labelLine={false}
                  >
                    <Cell fill="#82ca9d" /> {/* Color verde para Respuestas Correctas */}
                    <Cell fill="#ff6b6b" /> {/* Color rojo para Respuestas Incorrectas */}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          ) : (
            <p><FormattedMessage id="noParticipationData" className="Participation-text"/></p>
          )
        )}
      </div>
    </main>
  );
};