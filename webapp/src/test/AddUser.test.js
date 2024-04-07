import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from '../components/AddUser';
import { SessionContext } from '../SessionContext';

const mockAxios = new MockAdapter(axios);
const handleImageClick = jest.fn();

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    render(
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}}/>
      </SessionContext.Provider>
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
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}}/>
      </SessionContext.Provider>
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
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}}/>
      </SessionContext.Provider>
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

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Internal Server Error/i)).toBeInTheDocument();
    });
  });

  test('selección de imagen de perfil', async () => {
    const { getByAltText } =     render(
      <SessionContext.Provider value={{ saveSessionData: () => {},clearSessionData: jest.fn() }}> 
        <AddUser goTo={(parameter) => {}}/>
      </SessionContext.Provider>
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
});
