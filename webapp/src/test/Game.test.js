import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Game } from '../components/Game';

describe('Game component', () => {
  test('renders question correctly', () => {
    render(<Game goTo={(parameter) => {}} />); // Renderizar el componente Game

    // Verificar que las opciones de respuesta se muestran correctamente
    const options = screen.getAllByRole('button');
    expect(options).toHaveLength(5); // Verificar que hay cuatro opciones
  });

  test('clicking "Volver al menú" calls goTo function with correct argument', () => {
    const goToMock = jest.fn(); // Crear una función simulada
    render(<Game goTo={goToMock} />); // Renderizar el componente Game con la función simulada
    
    // Simular clic en el botón "Volver al menú"
    fireEvent.click(screen.getByText('Volver al menú'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 1)
    expect(goToMock).toHaveBeenCalledWith(1);
  });
});
