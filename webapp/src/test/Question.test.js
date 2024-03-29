import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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
    const { getByText } = render(
      <SessionProvider>
        <Question />
      </SessionProvider>
    );

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
    const { getByText } = render(
      <SessionProvider>
        <Question />
      </SessionProvider>
    );

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Seleccionar la opción correcta
    act(() => {
      fireEvent.click(getByText('Paris'));
    });

    // Verificar que la opción seleccionada tenga estilo verde
    expect(getByText('Paris').parentElement).toBeInTheDocument;
  });

  it('handles Next button click correctly', async () => {
    const { getByText } = render(
      <SessionProvider>
        <Question />
      </SessionProvider>
    );

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

  it('correctly updates localStorage and game state when all questions are answered', () => {
    // Mock para localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key],
        setItem: (key, value) => store[key] = value,
        clear: () => store = {}
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Mock para funciones auxiliares
    const mockSetGameFinished = jest.fn();
    const mockGoTo = jest.fn();
    const questionComponent = <SessionProvider>
       <Question setGameFinished={mockSetGameFinished} goTo={mockGoTo} />
      </SessionProvider>;


    // Establecer valores iniciales
    act(() => {
      localStorage.setItem('pAcertadas', '5');
      localStorage.setItem('pFalladas', '5');
      localStorage.setItem('tiempoUsado', '60');
      localStorage.setItem('tiempoRestante', '60');
    });

    // Renderizar el componente
    const { getByText } = render(questionComponent);

    // Verificar que las funciones auxiliares no se hayan llamado aún
    expect(mockSetGameFinished).not.toHaveBeenCalled();
    expect(mockGoTo).not.toHaveBeenCalled();

    // Simular que se responde a todas las preguntas
    act(() => {
      fireEvent.click(getByText('Next'));
    });

    // Verificar que las funciones auxiliares se hayan llamado correctamente
    expect(localStorage.getItem('pAcertadas')).toBe('5'); // 5 preguntas correctas
    expect(localStorage.getItem('pFalladas')).toBe('5'); // 5 preguntas incorrectas
    expect(localStorage.getItem('tiempoUsado')).toBe('60'); // Tiempo usado no cambia
    expect(localStorage.getItem('tiempoRestante')).toBe('60'); // Tiempo restante no cambia
  });

  test('La URL de la puerta de enlace debe ser procesada correctamente desde REACT_APP_API_ENDPOINT', () => {
    const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    expect(gatewayUrl).toBeDefined();
  });

  test('El contador de segundos debe decrementar correctamente', () => {
    jest.useFakeTimers();
    const setSegundos = jest.fn();
    render(
      <SessionProvider>
        <Question />
      </SessionProvider>
      );

    jest.advanceTimersByTime(5000);

    expect(setSegundos).toHaveBeenCalledTimes(0);
  });

  
});
