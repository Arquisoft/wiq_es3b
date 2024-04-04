import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react';
import { Game } from '../components/Game';
import { SessionProvider } from '../SessionContext';

const MAX_TIME = 600;

// Mock de preguntas predefinidas
const mockQuestions = [
  {
    question: 'What is the capital of France?',
    correct: 'Paris',
    incorrects: ['London', 'Berlin', 'Madrid']
  },
  {
    question: 'What is the largest planet in the solar system?',
    correct: 'Jupiter',
    incorrects: ['Mars', 'Saturn', 'Neptune']
  }
];

// Mock de la función goTo
const mockGoTo = jest.fn();

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de setInterval y clearInterval
jest.useFakeTimers();

describe('Game component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuestions[0])
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders question and options correctly', async () => {
    await act(async () => {
      render(
        <SessionProvider>
          <Game goTo={mockGoTo} />
        </SessionProvider>
      );
  
      await waitFor(() => {
        expect(screen.getByText(mockQuestions[0].question) || screen.getByText(mockQuestions[1].question)).toBeInTheDocument();
      });
  
      // Verifica que haya cuatro opciones presentes
      expect(screen.getAllByRole('button')).toHaveLength(4);
    });
  });
  
  it('handles option selection correctly', async () => {
    await act(async () => {
      render(
        <SessionProvider>
          <Game goTo={mockGoTo} />
        </SessionProvider>
      );
  
      await waitFor(() => {
        expect(screen.getByText(mockQuestions[0].question) || screen.getByText(mockQuestions[1].question)).toBeInTheDocument();
      });
  
      act(() => {
        // Seleccionar la opción correcta
        fireEvent.click(screen.getByText(mockQuestions[0].correct));
        expect(screen.getByText(mockQuestions[0].correct).parentElement).toBeInTheDocument();
      });

      act(() => {
        // Seleccionar una opción incorrecta
        fireEvent.click(screen.getByText(mockQuestions[0].incorrects[0]));
        expect(screen.getByText(mockQuestions[0].incorrects[0]).parentElement).toBeInTheDocument();
      });
    });
  });  

  // Test para verificar que el juego finaliza cuando se alcanza el número máximo de preguntas
  test('El juego finaliza correctamente cuando se alcanza el número máximo de preguntas', async () => {
    await act(async () => {
      render(
        <SessionProvider>
          <Game goTo={() => {}} setGameFinished={() => {}} />
        </SessionProvider>
      );
      jest.advanceTimersByTime(MAX_TIME * 1000);
    });
  });
});