import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostGame } from '../components/PostGame';

describe('PostGame component', () => {
  test('renders "FIN" text correctly', () => {
    render(<PostGame />);

    // Verifica que el texto "Fin del juego" se renderice correctamente
    expect(screen.getByText('Fin del juego')).toBeInTheDocument();
  });

  test('renders "Preguntas acertadas" text correctly', () => {
    render(<PostGame />);

    // Verifica que el texto "Preguntas acertadas" se renderice correctamente
    expect(screen.getByText('Preguntas acertadas')).toBeInTheDocument();
  });
});
