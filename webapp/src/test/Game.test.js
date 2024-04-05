import React from 'react';
import { render, fireEvent, act, waitFor, findByText, screen } from '@testing-library/react';
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

    await waitFor(() => {
      expect(getByText(mockQuestions[0].question)).toBeInTheDocument();
    });

    // Seleccionar la opción correcta
    fireEvent.click(getByText(mockQuestions[0].correct));
    expect(getByText(mockQuestions[0].correct).parentElement.toBeInTheDocument);

    // Seleccionar una opción incorrecta
    fireEvent.click(getByText(mockQuestions[0].incorrects[0]));
    expect(getByText(mockQuestions[0].incorrects[0]).parentElement.toBeInTheDocument);
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

  test('renders Game component with default category', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });

  test('renders Game component with category buttons', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    expect(getByText(/All Categories/i)).toBeInTheDocument();
    expect(getByText("Art")).toBeInTheDocument();
    expect(getByText(/Sports/i)).toBeInTheDocument();
    expect(getByText(/Entertainment/i)).toBeInTheDocument();
    expect(getByText(/Geography/i)).toBeInTheDocument();
    expect(getByText(/Planets/i)).toBeInTheDocument();
  });

  test('changes category when All Categories category button is clicked', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    fireEvent.click(getByText(/All Categories/i));
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });

  test('changes category when Art category button is clicked', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    fireEvent.click(getByText("Art"));
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });

  test('changes category when Sports category button is clicked', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    fireEvent.click(getByText(/Sports/i));
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });

  test('changes category when Entertainment category button is clicked', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    fireEvent.click(getByText(/Entertainment/i));
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });

  test('changes category when Geography category button is clicked', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    fireEvent.click(getByText(/Geography/i));
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });

  test('changes category when Planets category button is clicked', () => {
    const { getByText } = render(<SessionProvider><Game gameMode="category" /></SessionProvider>);
    fireEvent.click(getByText(/Planets/i));
    expect(getByText(/Restart game with a new category/i)).toBeInTheDocument();
  });
});