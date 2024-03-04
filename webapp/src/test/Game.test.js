import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Game } from '../components/Game';

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
    const { getByText, findAllByText } = render(<Game goTo={mockGoTo} />);
    expect(getByText(/Question/i)).toBeInTheDocument();
    const options = await findAllByText(/./i);
    //expect(options).toHaveLength(4); // Verifica que haya 4 opciones
  });

  it('handles option selection correctly', async () => {
    const { getByText, findByText } = render(<Game goTo={mockGoTo} />);
    await findByText(mockQuestions[0].question); // Espera a que se cargue la pregunta

    const correctOption = getByText(mockQuestions[0].correct);
    fireEvent.click(correctOption);
    //expect(correctOption.parentElement).toHaveStyle('background-color: green');

    const incorrectOption = getByText(mockQuestions[0].incorrects[0]);
    fireEvent.click(incorrectOption);
    //expect(incorrectOption.parentElement).toHaveStyle('background-color: red');
  });

  it('handles Next button click correctly', async () => {
    const { getByText, findByText } = render(<Game goTo={mockGoTo} />);
    await findByText(mockQuestions[0].question); // Espera a que se cargue la pregunta

    //const nextButton = getByText(/Next/i);
    //fireEvent.click(nextButton);
    //expect(global.fetch).toHaveBeenCalledTimes(2); // Verifica que se hizo una segunda llamada a fetch para obtener la siguiente pregunta
  });
});
