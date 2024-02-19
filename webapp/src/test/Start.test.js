import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Start } from '../components/Start';

describe('Start component', () => {
  test('renders correctly', () => {
    render(<Start goTo={(parameter) => {}} />); // Renderizar el componente Start
    
    // Verificar que el texto "Quiz ASW" se muestra correctamente
    const titleText = screen.getByText(/Quiz ASW/i);
    expect(titleText).toBeInTheDocument();

    // Verificar que el botón "Jugar" se muestra correctamente
    const playButton = screen.getByRole('button', { name: /Jugar/i });
    expect(playButton).toBeInTheDocument();
  });

  test('clicking "Jugar" button calls goTo function with correct argument', () => {
    const goToMock = jest.fn(); // Crear una función simulada
    render(<Start goTo={goToMock} />); // Renderizar el componente Start con la función simulada
    
    // Simular clic en el botón "Jugar"
    fireEvent.click(screen.getByText('Jugar'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 2)
    expect(goToMock).toHaveBeenCalledWith(2);
  });
});
