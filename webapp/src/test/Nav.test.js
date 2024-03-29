import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Nav from '../components/Nav';
import { SessionProvider } from '../SessionContext';



describe('Nav Component', () => {

  test('opens and closes navigation menu on menu icon click', async () => {
    const { getByLabelText, queryByText } = render(
      <SessionProvider>
        <Nav />
      </SessionProvider>
    );
    const menuIcon = getByLabelText('account of current user');

    fireEvent.click(menuIcon);
    await waitFor(() => {
      expect(queryByText('Volver al menú')).toBeInTheDocument();
    });

  });

  test('opens and closes user menu on avatar click', async () => {
    const { getByAltText, queryByText } = render(
      <SessionProvider>
        <Nav />
      </SessionProvider>
    );
    const avatar = getByAltText('Remy Sharp');

    fireEvent.click(avatar);
    await waitFor(() => {
      expect(queryByText('Profile')).toBeInTheDocument();
    });

  });

  test('calls goTo function when "Menu" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <SessionProvider>
        <Nav goTo={goToMock} />
      </SessionProvider>
    );
    fireEvent.click(getByText('Menu'));
    await waitFor(() => {
      expect(goToMock).toHaveBeenCalledTimes(1);
    });
  });

  test('calls goTo function when "Logout" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <SessionProvider>
        <Nav goTo={goToMock} />
      </SessionProvider>
    );
    fireEvent.click(getByText('Logout'));
    await waitFor(() => {
      expect(goToMock).toHaveBeenCalledTimes(1);
    });
  });

  test('displays username correctly from session context', async () => {
    // Simula el contexto de sesión con un nombre de usuario
    const sessionDataMock = { username: '' };
  
    // Renderiza el componente Nav dentro del SessionProvider con el contexto de sesión simulado
    const { getByText } = render(
      <SessionProvider value={{ sessionData: sessionDataMock }}>
        <Nav />
      </SessionProvider>
    );
  
    // Verifica que el nombre de usuario se muestre correctamente en el componente
    expect(getByText('noUser')).toBeInTheDocument();
  });

  test('calls goToMenuClic when the button "Menu" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <SessionProvider>
        <Nav goTo={goToMock} />
      </SessionProvider>
      );
    const button = getByText('Menu');

    fireEvent.click(button);

    expect(goToMock).toHaveBeenCalled();
  });

  test('calls goToMenuClic when the button "ASW WIQ" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <SessionProvider>
        <Nav goTo={goToMock} />
      </SessionProvider>
      );
    const button = getByText('ASW WIQ');

    fireEvent.click(button);

    expect(goToMock).toHaveBeenCalled();
  });

  test('calls goToMenuClic when the button "Volver al menú" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <SessionProvider>
        <Nav goTo={goToMock} />
      </SessionProvider>
      );
    const button = getByText('Volver al menú');

    fireEvent.click(button);

    expect(goToMock).toHaveBeenCalled();
  });
});
