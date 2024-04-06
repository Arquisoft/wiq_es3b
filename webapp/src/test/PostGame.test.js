import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PostGame } from '../components/PostGame';
import { SessionContext } from '../SessionContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('PostGame component', () => {
  test('renders "Game Over" text correctly', () => {
    // Mock the SessionContext value
    const sessionData = {
      userId: 'mockedUserId',
    };

    render(
      <SessionContext.Provider value={{ sessionData }}>
        <PostGame />
      </SessionContext.Provider>
    );

    // Verificar que el texto "Game Over" se muestra correctamente
    const gameOverText = screen.getAllByText(/Game Over/i);
    expect(gameOverText.length).toBeGreaterThan(0);
  });

  test('renders text correctly', () => {
    // Mock the SessionContext value
    const sessionData = {
      userId: 'mockedUserId',
    };

    render(
      <SessionContext.Provider value={{ sessionData }}>
        <PostGame gameMode="classic" />
      </SessionContext.Provider>
    );

    // Verificar que los textos esperados se muestran correctamente
    expect(screen.getByText('Correct answers')).toBeInTheDocument();
    expect(screen.getByText('Incorrect answers')).toBeInTheDocument();
    expect(screen.getByText('Elapsed time')).toBeInTheDocument();
    expect(screen.queryByText('Time remaining')).toBeInTheDocument();
  });

  test('saves game data correctly', async () => {
    // Mock the SessionContext value
    const mockSessionData = { userId: 'mockUserId'};
    const mockResponse = { data: 'Mock response data' };

    axios.post.mockResolvedValue(mockResponse);

    act(() => {
      localStorage.setItem('pAcertadas', 5);
      localStorage.setItem('pFalladas', 5);
      localStorage.setItem('tiempoUsado', 120);
    });

    render(
      <SessionContext.Provider value={{ sessionData: mockSessionData }}>
        <PostGame />
      </SessionContext.Provider>
    );

    // Check if saveGame function is called correctly
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/addgame',
      {
        user: mockSessionData.userId,
        pAcertadas: localStorage.getItem('pAcertadas'), 
        pFalladas: localStorage.getItem('pFalladas'),
        totalTime: localStorage.getItem('tiempoUsado')
      }
    );
  });
});