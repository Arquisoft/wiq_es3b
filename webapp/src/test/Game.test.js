import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '../components/Game';

describe('Game component', () => {
  test('renders question correctly', async () => {
    render(<Game goTo={(parameter) => {}} />);

    // Espera a que se cargue la pregunta
    await waitFor(() => screen.getByText(/Question/i));

    // Verifica que la pregunta se renderice correctamente
    expect(screen.getByText(/Question/i)).toBeInTheDocument();
    
    // Verifica que las opciones se rendericen correctamente
    const options = await screen.findAllByRole('button');
    expect(options).toHaveLength(4); // Ajusta esto según la cantidad de opciones que tengas en tu componente
    
    // Simula hacer clic en la primera opción
    fireEvent.click(options[0]);

    // Espera a que se cargue la próxima pregunta
    await waitFor(() => screen.getByText(/Question/i));

    // Verifica que la próxima pregunta se renderice correctamente
    expect(screen.getByText(/Question/i)).toBeInTheDocument();
  });
});
