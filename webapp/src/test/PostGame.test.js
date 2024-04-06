import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostGame } from '../components/PostGame';
import axios from 'axios';

// Mock the Typography component
jest.mock('@mui/material/Typography', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => {
      return <span>{children}</span>;
    }),
  };
});

// Mock the Card component
jest.mock('@mui/material/Card', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => {
      return <div>{children}</div>;
    }),
  };
});

// Mock the useContext hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('axios');

describe('PostGame component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders "FIN" text correctly', () => {
    // Mock the SessionContext value
    const mockSessionData = { userId: 'mockUserId' };
    React.useContext.mockReturnValue({ sessionData: mockSessionData });

    axios.post.mockResolvedValue({ data: 'Mock response data' });

    render(<PostGame />);

    // Verifies that the text "Game Over" is rendered correctly
    expect(screen.getByText('Game Over')).toBeInTheDocument();

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/addgame',
      expect.any(Object)
    );
  });

  test('renders text correctly', () => {
    // Mock the SessionContext value
    const mockSessionData = { userId: 'mockUserId' };
    React.useContext.mockReturnValue({ sessionData: mockSessionData });

    render(<PostGame gameMode="classic" />);

    // Verifies that the text "Correct answers" is rendered correctly
    expect(screen.getByText('Correct answers')).toBeInTheDocument();

    // Verifies that the text "Incorrect answers" is rendered correctly
    expect(screen.getByText('Incorrect answers')).toBeInTheDocument();

    // Verifies that the text "Elapsed time" is rendered correctly
    expect(screen.getByText('Elapsed time')).toBeInTheDocument();

    // Verifies that the text "Time remaining" is rendered correctly
    expect(screen.getByText('Time remaining')).toBeInTheDocument();
  });

  test('formatTiempo returns the correct time format', () => {
    // Example input data and expected output
    const seconds = 0; // 0 seconds
    const expectedTime = '00:00';

    // Mock the SessionContext value
    const mockSessionData = { userId: 'mockUserId' };
    React.useContext.mockReturnValue({ sessionData: mockSessionData });

    // Render the PostGame component containing the formatTiempo function
    render(<PostGame />);

    // Get the component that displays the elapsed time
    const elapsedTimeCell = screen.getByText('Elapsed time').closest('tr').querySelector('td:last-child');

    // Check if the component's text matches the expected time
    expect(elapsedTimeCell.textContent).toBe(expectedTime);
  });
});