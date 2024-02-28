import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Game } from '../components/Game';

describe('Game component', () => {
  test('renders question correctly', async () => {
    render(<Game goTo={(parameter) => {}} />);

    // Espera a que se cargue la pregunta
    await waitFor(() => screen.getByText(/Question/i));

    // Verifica que la pregunta se renderice correctamente
    expect(screen.getByText(/Question/i)).toBeInTheDocument();
    
  });
});
