import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

export const Participation = ({ userId, goTo }) => {
  const [participationData, setParticipationData] = useState(null);

  useEffect(() => {
    // Realizar la solicitud al servidor para obtener los datos de participación
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8005/getParticipation/${userId}`);
        setParticipationData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos de participación:', error);
      }
    };

    fetchData();
  }, [userId]);

  //Gráfica
  const data = {
    labels: ['Preguntas Acertadas', 'Preguntas Falladas'],
    datasets: [
      {
        label: 'Número de preguntas',
        data: [participationData?.correctAnswers || 0, participationData?.incorrectAnswers || 0],
        backgroundColor: ['green', 'red'],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(participationData?.correctAnswers || 0, participationData?.incorrectAnswers || 0) + 1,
      },
    },
  };

  return (
    <div>
      <h1>Participation</h1>
      {participationData ? (
        <div>
          <p>Número de partidas jugadas: {participationData.totalGames}</p>
          <p>Preguntas acertadas: {participationData.correctAnswers}</p>
          <p>Preguntas falladas: {participationData.incorrectAnswers}</p>
          <p>Tiempo total jugando: {participationData.totalTime} segundos</p>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p>Cargando datos de participación...</p>
      )}
      <button onClick={() => goTo(0)}>Menú</button>
    </div>
  );
};