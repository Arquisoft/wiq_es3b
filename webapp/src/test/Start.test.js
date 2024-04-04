import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Start } from '../components/Start';

describe('Start component', () => {
  test('renders correctly', () => {
    render(<Start goTo={(parameter) => {}} />); // Renderizar el componente Start
    
    // Verificar que el texto "Quiz ASW" se muestra correctamente
    const titleText = screen.getByText(/ASW Quiz - WIQ/i);
    expect(titleText).toBeInTheDocument();

    // Verificar que el botón "Jugar" se muestra correctamente
    const playButton = screen.getByRole('button', { name: /Play/i });
    expect(playButton).toBeInTheDocument();

    // Verificar que el botón "Participacion" se muestra correctamente
    const participationButton = screen.getByRole('button', { name: /Participation/i });
    expect(participationButton).toBeInTheDocument();
  });

  test('clicking "Jugar" button calls goTo function with correct argument', () => {
    const goToMock = jest.fn(); // Crear una función simulada
    render(<Start goTo={goToMock} />); // Renderizar el componente Start con la función simulada
    
    // Simular clic en el botón "Jugar"
    fireEvent.click(screen.getByText('Play'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 2)
    expect(goToMock).toHaveBeenCalledWith(2);
  });

  test('clicking "Participación" button calls goTo function with correct argument', () => {
    const goToMock = jest.fn(); // Crear una función simulada
    render(<Start goTo={goToMock} />); // Renderizar el componente Start con la función simulada
    
    // Simular clic en el botón "Participación"
    fireEvent.click(screen.getByText('Participation'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 3)
    expect(goToMock).toHaveBeenCalledWith(3);
  });
});
