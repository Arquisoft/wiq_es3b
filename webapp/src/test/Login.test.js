import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../components/Login';
import { SessionContext } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

const mockAxios = new MockAdapter(axios);
const mockChangeLanguage = jest.fn();

const mockValue = {
  saveSessionData: () => {}
};

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should log in successfully', async () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={mockValue}>
        <Login goTo={() => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
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

    // Verify that login was successful
    await waitFor(() => {
      expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
    });
  });

  it('should handle error when logging in', async () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={mockValue}>
        <Login goTo={() => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simulate user input and login button click
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Verify that the user information is not displayed
    expect(screen.queryByText(/Hello testUser!/i)).toBeNull();
    expect(screen.queryByText(/Your account was created on/i)).toBeNull();
  });

  it('should call autologin function when sessionData has token', async () => {
    const goToMock = jest.fn();
    const sessionData = { token: 'testToken' };

    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ ...mockValue, sessionData }}>
        <Login goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
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
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ ...mockValue, sessionData }}>
        <Login goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );

    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(0);
    });

    expect(goToMock).not.toHaveBeenCalled();
  });

  it('should call goTo function when response status is 200', async () => {
    const goToMock = jest.fn();
  
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={mockValue}>
        <Login goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );
  
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
  
    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });
  
    // Simulate user input and login button click
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
      fireEvent.click(loginButton);
    });
  
    // Wait for the goTo function to be called
    await waitFor(() => {
      expect(goToMock).toHaveBeenCalledWith(1);
    });
  });  
});
