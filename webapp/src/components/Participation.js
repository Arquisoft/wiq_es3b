import React from 'react';
import Chart from "chart.js/auto";

const mongoose = require('mongoose');

// Número de juegos, preguntas acertadas/falladas, tiempos 
// Esquema de preguntas -> question, correct, incorrects[]
// Esquema de Juegos -> usuario, preguntas[], respuestas[], tiempo

export const Participation = ({ goTo }) => {
  return (
    <div>
      <h1>Participation</h1>
      <button onClick={() => goTo(0)}>Menu</button>
    </div>
  );
};
