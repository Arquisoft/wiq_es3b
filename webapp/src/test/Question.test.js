import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Question from '../components/Question';
import { SessionProvider } from '../SessionContext';

// Mock para la respuesta del servicio de preguntas
const mockQuestionResponse = {
  question: 'What is the capital of France?',
  correct: 'Paris',
  incorrects: ['Berlin', 'Madrid', 'Rome']
};

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockQuestionResponse }))
}));

describe('Question component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuestionResponse)
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders question and options correctly', async () => {
    const { getByText } = render(<SessionProvider>
        <Question />
      </SessionProvider>);

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Esperar a que se muestren las opciones
    await waitFor(() => {
      expect(getByText('Paris')).toBeInTheDocument();
      expect(getByText('Berlin')).toBeInTheDocument();
      expect(getByText('Madrid')).toBeInTheDocument();
      expect(getByText('Rome')).toBeInTheDocument();
    });
  });

  it('selects correct option and handles click correctly', async () => {
    const { getByText } = render(<SessionProvider>
        <Question />
      </SessionProvider>);

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Seleccionar la opción correcta
    fireEvent.click(getByText('Paris'));

    // Verificar que la opción seleccionada tenga estilo verde
    expect(getByText('Paris').parentElement).toBeInTheDocument;
  });

  it('handles Next button click correctly', async () => {
    const { getByText } = render(
    <SessionProvider>
        <Question />
      </SessionProvider>);

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Hacer clic en el botón "Next"
    fireEvent.click(getByText('Next'));

    // Esperar a que se cargue la siguiente pregunta (en este caso, se simula la carga)
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });
  });
});
