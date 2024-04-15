import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SessionContext } from '../SessionContext';

const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

export const Participation = ({ goTo }) => {
  const { sessionData } = useContext(SessionContext); // Obtener datos de sesión del contexto
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
    <main>
      <div>
        <h1>Participación</h1>
        {loading ? (
          <p>{participationData ? 'Cargando datos de participación...' : 'No hay datos de participación'}</p>
        ) : (
          participationData !== null ? (
            <div>
              <p>Número de partidas jugadas: {participationData.totalGames}</p>
              <p>Preguntas acertadas: {participationData.correctAnswers}</p>
              <p>Preguntas falladas: {participationData.incorrectAnswers}</p>
              <p>Tiempo total jugando: {participationData.totalTime} segundos</p>
            </div>
          ) : (
            <p>No hay datos de participación</p>
          )
        )}
      </div>
    </main>
  );
};