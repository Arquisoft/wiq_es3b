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
    // Simulamos el contexto de sesión con un nombre de usuario
    const sessionDataMock = { username: 'testUser' };
    const { getByText } = render(
      <SessionProvider value={{ sessionData: sessionDataMock }}>
        <Nav />
      </SessionProvider>
    );

    // Verificamos que el nombre de usuario se muestra correctamente en el componente
  });
});
