import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/participation.css';
import { SessionContext } from '../SessionContext';
import { FormattedMessage } from 'react-intl';

import { PieChart, Pie, Tooltip } from 'recharts';

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
      <h1 className="Participation-title"><FormattedMessage id="participationTitle" /></h1>

      {loading ? (
        <p><FormattedMessage id={participationData ? "loadingData" : "noParticipationData"} className="Participation-text"/></p>
      ) : (
        participationData !== null ? (
          <div className="Participation-text">
            <p><FormattedMessage id="totalGames" />: {participationData.totalGames}</p>
            <p><FormattedMessage id="correctAnswers" />: {participationData.correctAnswers}</p>
            <p><FormattedMessage id="incorrectAnswers" />: {participationData.incorrectAnswers}</p>
            <p><FormattedMessage id="totalTime" />: {participationData.totalTime} <FormattedMessage id="seconds" /></p>

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
        ) : (
          <p><FormattedMessage id="noParticipationData" className="Participation-text"/></p>
        )
      )}
      </div>
    </main>
  );
};