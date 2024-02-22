import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Participation } from '../components/Participation';

describe('Participation component', () => {
  test('renders correctly', () => {
    render(<Participation goTo={(parameter) => {}} />);

    // Verificar que el texto "Participation" se muestra correctamente
    const titleText = screen.getByText(/Participation/i);
    expect(titleText).toBeInTheDocument();

    // Verificar que el botón "Menu" se muestra correctamente
    const menuButton = screen.getByRole('button', { name: /Menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  test('clicking "Menu" button calls goTo function with correct argument', () => {
    const goToMock = jest.fn();
    render(<Participation goTo={goToMock} />);

    // Simular clic en el botón "Menu"
    fireEvent.click(screen.getByText('Menu'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 0)
    expect(goToMock).toHaveBeenCalledWith(0);
  });
});
