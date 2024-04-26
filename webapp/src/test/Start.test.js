import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Start } from '../components/Start';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

describe('Start component', () => {
  test('renders correctly', () => {
    render(<IntlProvider locale={"en"} messages={messages_en}><Start goTo={(parameter) => {}} /></IntlProvider>); // Renderizar el componente Start
    
    // Verificar que el texto "Quiz ASW" se muestra correctamente
    const titleText = screen.getByText(/ASW Quiz - WIQ/i);
    expect(titleText).toBeInTheDocument();

    // Verificar que el botón "Jugar" se muestra correctamente
    const playButton = screen.getByRole('button', { name: /Classic Game/i });
    expect(playButton).toBeInTheDocument();

    // Verificar que el botón "Participacion" se muestra correctamente
    const participationButton = screen.getByRole('button', { name: /Participation/i });
    expect(participationButton).toBeInTheDocument();
  });

  test('clicking "Jugar" button calls goTo function with correct argument', () => {
    const goToMock = jest.fn(); // Crear una función simulada
    render(<IntlProvider locale={"en"} messages={messages_en}><Start goTo={goToMock} /></IntlProvider>); // Renderizar el componente Start con la función simulada
    
    // Simular clic en el botón "Jugar"
    fireEvent.click(screen.getByText('Classic Game'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 2)
    expect(goToMock).toHaveBeenCalledWith(2);
  });

  test('clicking "Participación" button calls goTo function with correct argument', () => {
    const goToMock = jest.fn(); // Crear una función simulada
    render(<IntlProvider locale={"en"} messages={messages_en}><Start goTo={goToMock} /></IntlProvider>); // Renderizar el componente Start con la función simulada
    
    // Simular clic en el botón "Participación"
    fireEvent.click(screen.getByText('Participation'));

    // Verificar que la función goTo se llamó con el argumento correcto (en este caso, 6)
    expect(goToMock).toHaveBeenCalledWith(7);
  });

  it('should trigger the correct function when a button is clicked', () => {
    const goToMock = jest.fn();
    const { getByText } = render(<IntlProvider locale={"en"} messages={messages_en}><Start goTo={goToMock} /></IntlProvider>);
    
    // Simular clic en el botón "Infinite Mode"
    fireEvent.click(getByText('Infinite Mode'));
    expect(goToMock).toHaveBeenCalledWith(3);
    
    // Simular clic en el botón "Three Lifes Classic"
    fireEvent.click(getByText('Three Lifes Classic'));
    expect(goToMock).toHaveBeenCalledWith(4);
    
    // Simular clic en el botón "Category Mode"
    fireEvent.click(getByText('Category Mode'));
    expect(goToMock).toHaveBeenCalledWith(5);
  });
});
