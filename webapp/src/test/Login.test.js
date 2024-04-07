import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../components/Login';
import { SessionContext } from '../SessionContext';

const mockAxios = new MockAdapter(axios);

const mockValue = {
  saveSessionData: () => {}
};

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should log in successfully', async () => {

    render(
      <SessionContext.Provider value={mockValue}>
        <Login goTo={(parameter) => {}} />
      </SessionContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });

    // Simulate user input
    await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(loginButton);
      });
  });

  it('should handle error when logging in', async () => {

    render(
      <SessionContext.Provider value={mockValue}>
        <Login goTo={(parameter) => {}} />
      </SessionContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

    // Verify that the user information is not displayed
    expect(screen.queryByText(/Hello testUser!/i)).toBeNull();
    expect(screen.queryByText(/Your account was created on/i)).toBeNull();
  });
  it('should call autologin function when sessionData has token', async () => {
    const goToMock = jest.fn();
    const sessionData = { token: 'testToken' };

    render(
      <SessionContext.Provider value={{ ...mockValue, sessionData }}>
        <Login goTo={goToMock} />
      </SessionContext.Provider>
    );

    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1);
      expect(mockAxios.history.get[0].url).toBe('http://localhost:8000/verify');
      expect(mockAxios.history.get[0].headers.Authorization).toBe('Bearer testToken');
    });
  });

  it('should not call autologin function when sessionData does not have token', async () => {
    const goToMock = jest.fn();
    const sessionData = {};

    render(
      <SessionContext.Provider value={{ ...mockValue, sessionData }}>
        <Login goTo={goToMock} />
      </SessionContext.Provider>
    );

    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(0);
    });

    expect(goToMock).not.toHaveBeenCalled();
  });
});
