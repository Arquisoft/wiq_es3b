import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PostGame } from '../components/PostGame';
import { SessionContext } from '../SessionContext';
import axios from 'axios';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn()
}));

jest.setTimeout(10000);

describe('PostGame component', () => {
  test('renders "Game Over" text correctly', () => {
    // Mock the SessionContext value
    const sessionData = {
      userId: 'mockedUserId',
      token: 'mockedToken'
    };

    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData }}>
        <PostGame />
      </SessionContext.Provider></IntlProvider>
    );

    // Verificar que el texto "Game Over" se muestra correctamente
    const gameOverText = screen.getAllByText(/Game Over/i);
    expect(gameOverText.length).toBeGreaterThan(0);
  });

  test('renders text correctly', () => {
    // Mock the SessionContext value
    const sessionData = {
      userId: 'mockedUserId',
      token: 'mockedToken'
    };

    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData }}>
        <PostGame gameMode="classic" />
      </SessionContext.Provider></IntlProvider>
    );

    // Verificar que los textos esperados se muestran correctamente
    expect(screen.getByText('Correct answers')).toBeInTheDocument();
    expect(screen.getByText('Incorrect answers')).toBeInTheDocument();
    expect(screen.getByText('Elapsed time')).toBeInTheDocument();
    expect(screen.queryByText('Time remaining')).toBeInTheDocument();
  });

  test('saves game data correctly', async () => {
    // Mock the SessionContext value
    const mockSessionData = { userId: 'mockUserId', token: 'mockToken'};
    const mockResponse = { data: 'Mock response data' };

    axios.post.mockResolvedValue(mockResponse);
    act(() => {
      localStorage.setItem('pAcertadas', 5);
      localStorage.setItem('pFalladas', 5);
      localStorage.setItem('tiempoUsado', 120);
    });

    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData: mockSessionData }}>
        <PostGame />
      </SessionContext.Provider></IntlProvider>
    );

    // Check if saveGame function is called correctly
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/games',
      {
        user: mockSessionData.userId,
        pAcertadas: localStorage.getItem('pAcertadas'), 
        pFalladas: localStorage.getItem('pFalladas'),
        totalTime: localStorage.getItem('tiempoUsado'),
        gameMode: undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${mockSessionData.token}`
        }
      }
    );
    // Check if the snackbar is displayed
    expect(await screen.findByText('Game saved successfully')).toBeInTheDocument();
  });
  test('closes the snackbar correctly', () => {
    // Mock the SessionContext value
    const sessionData = {
      userId: 'mockedUserId',
      token: 'mockedToken'
    };

    // Mock the setOpenSnackbar function
    const setOpenSnackbar = jest.fn();
    const handleCloseSnackbar = jest.fn();
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData }}>
      <PostGame setOpenSnackbar={setOpenSnackbar} handleCloseSnackbar={handleCloseSnackbar} />
      </SessionContext.Provider></IntlProvider>
    );

    // Set the initial state of the snackbar to open
    act(() => {
      setOpenSnackbar(false);
    });

    // Call the handleCloseSnackbar function
    act(() => {
      handleCloseSnackbar();
    });

    // Check if setOpenSnackbar is false
    expect(setOpenSnackbar).toHaveBeenCalledWith(false);

    // Check if the snackbar is closed
    expect(screen.queryByText('Game saved successfully')).not.toBeInTheDocument();
  });
  test('displays error snackbar correctly', async () => {
    // Mock the SessionContext value
    const sessionData = {
      userId: 'mockedUserId',
      token: 'mockedToken'
    };
    // Mock the axios post function to throw an error
    axios.post.mockRejectedValue(new Error('Mock error'));
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData }}>
        <PostGame />
      </SessionContext.Provider></IntlProvider>
    );
    // Check if saveGame function is called correctly
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/games',
      {
        user: sessionData.userId,
        pAcertadas: localStorage.getItem('pAcertadas'), 
        pFalladas: localStorage.getItem('pFalladas'),
        totalTime: localStorage.getItem('tiempoUsado'),
        gameMode: undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      }
    );
    // Check if the error snackbar is displayed
    expect(await screen.findByText('Error adding game')).toBeInTheDocument();
  });
});