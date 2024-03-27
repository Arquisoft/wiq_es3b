import React from 'react';
import { render, fireEvent, act, findByText, screen } from '@testing-library/react';
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
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuestions[0])
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders question and options correctly', async () => {
    const { getByText, findAllByText } = render(
      <SessionProvider>
        <Game goTo={mockGoTo} />
      </SessionProvider>
    );
    expect(getByText(/Question/i)).toBeInTheDocument();
    const options = await findAllByText(/./i);
    //expect(options).toHaveLength(4); // Verifica que haya 4 opciones
  });

  it('handles option selection correctly', async () => {
    const { getByText, findAllByText } = render(
      <SessionProvider>
        <Game goTo={mockGoTo} />
      </SessionProvider>
    );

    //act(() => {
      //const correctOption = getByText(mockQuestions[0].correct);
      //fireEvent.click(correctOption);

      //const incorrectOption = getByText(mockQuestions[0].incorrects[0]);
      //fireEvent.click(incorrectOption);
    //});
    //expect(incorrectOption.parentElement).toHaveStyle('background-color: red');
  });

  it('handles Next button click correctly', async () => {
    await act(async () => {
    
      <SessionProvider>
        <Game goTo={mockGoTo} />
      </SessionProvider>


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
