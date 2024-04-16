import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from '../components/AddUser';
import { SessionContext } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

const mockAxios = new MockAdapter(axios);
const mockChangeLanguage = jest.fn();

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}>
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText("Password");
    const passwordConfirmInput = screen.getByLabelText(/Confirm/i);
    const addUserButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);
    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  });

  it('passwords dont match', async () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}>
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );

    await waitFor(() => {
      //const imageDiv = screen.getByTestId('fotosPerfil');
      //expect(imageDiv).toBeInTheDocument();

      const iconButtonElements = screen.getAllByRole('button', { className: /fotoPerfilBtn/i });
      expect(iconButtonElements.length).toBeGreaterThan(4);

      const iconElements = screen.getAllByRole('img', { className: "fotoPerfil" });
      expect(iconElements.length).toBeGreaterThan(4);
    });

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText("Password");
    const passwordConfirmInput = screen.getByLabelText(/Confirm/i);
    const addUserButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);
    mockAxios.onPost('http://localhost:8000/login').reply(200);

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'randomPass' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  
  it('should handle error when adding user', async () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}>
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText("Password");
    const passwordConfirmInput = screen.getByLabelText(/Confirm/i);
    const addUserButton = screen.getByRole('button', { name: /SIGN UP/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });
    mockAxios.onPost('http://localhost:8000/login').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

  });

  test('selección de imagen de perfil', async () => {
    const { getByAltText } =     render(
      <IntlProvider locale={"en"} messages={messages_en}>
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );

    // Encuentra los botones de imagen de perfil
    const button1 = getByAltText('Imagen Perfil 1');
    const button2 = getByAltText('Imagen Perfil 2');
    const button3 = getByAltText('Imagen Perfil 3');
    const button4 = getByAltText('Imagen Perfil 4');
    const button5 = getByAltText('Imagen Perfil 5');

    // Simula hacer clic en cada botón
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);
    fireEvent.click(button4);
    fireEvent.click(button5);

  });
  it('should handle successful user registration and login', async () => {
    // Mock the response for successful user registration
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);
  
    // Mock the response for successful user login
    mockAxios.onPost('http://localhost:8000/login').reply(200, {
      createdAt: '2022-01-01',
      username: 'testUser',
      token: 'testToken',
      profileImage: 'testProfileImage',
      userId: 'testUserId',
    });
  
    const goToMock = jest.fn();
  
    // Render the component with mocked goTo function
    render(
      <IntlProvider locale={"en"} messages={messages_en}>
      <SessionContext.Provider value={{ saveSessionData: () => {}, clearSessionData: jest.fn() }}> 
        <AddUser goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionContext.Provider></IntlProvider>
    );
  
    // Find input fields and submit button
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm/i);
    const addUserButton = screen.getByRole('button', { name: /SIGN UP/i });
  
    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });
  
    // Trigger the add user button click
    fireEvent.click(addUserButton);
  
    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.queryByText(/Passwords do not match/i)).toBeNull();
    });
  
    // Ensure that loginSuccess is set to true
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  
    // Verify that the goTo function is called with 1
    expect(goToMock).toHaveBeenCalledWith(1);
  });  
});
