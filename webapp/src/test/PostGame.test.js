import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostGame } from '../components/PostGame';

describe('PostGame component', () => {
  test('renders "FIN" text correctly', () => {
    render(<PostGame />);

    // Verifica que el texto "Fin del juego" se renderice correctamente
    expect(screen.getByText('Fin del juego')).toBeInTheDocument();
  });

  test('renders text correctly', () => {
    render(<PostGame />);

    // Verifica que el texto "Preguntas acertadas" se renderice correctamente
    expect(screen.getByText('Preguntas acertadas')).toBeInTheDocument();

    // Verifica que el texto "Preguntas falladas" se renderice correctamente
    expect(screen.getByText('Preguntas falladas')).toBeInTheDocument();

    // Verifica que el texto "Tiempo usado" se renderice correctamente
    expect(screen.getByText('Tiempo usado')).toBeInTheDocument();

    // Verifica que el texto "Tiempo restante" se renderice correctamente
    expect(screen.getByText('Tiempo restante')).toBeInTheDocument();
  });

  test('formatTiempo devuelve el formato de tiempo correcto', () => {
    // Ejemplo de datos de entrada y salida esperada
    const segundos = 0; // 0 segundos
    const tiempoEsperado = '00:00';
  
    // Renderizar el componente PostGame que contiene la función formatTiempo
    render(<PostGame />);
  
    // Obtener el componente que muestra el tiempo usado
    const tiempoUsadoCell = screen.getByText('Tiempo usado').closest('tr').querySelector('td:last-child');
  
    // Verificar si el texto del componente coincide con el tiempo esperado
    expect(tiempoUsadoCell.textContent).toBe(tiempoEsperado);
  });
});
