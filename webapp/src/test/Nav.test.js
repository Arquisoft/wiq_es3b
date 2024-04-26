import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Nav from '../components/Nav';
import { SessionProvider, SessionContext } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

const mockChangeLanguage = jest.fn();

describe('Nav Component', () => {

  test('opens and closes navigation menu on menu icon click', async () => {
    const { getByLabelText, queryByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
    );
    const menuIcon = getByLabelText('account of current user');

    fireEvent.click(menuIcon);
    await waitFor(() => {
      expect(queryByText('Back to menu')).toBeInTheDocument();
    });

  });

  test('calls goTo function when "Menu" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
    );
    fireEvent.click(getByText('Menu'));
    await waitFor(() => {
      expect(goToMock).toHaveBeenCalledTimes(1);
    });
  });

  test('checks the value of href when "API-DOC" button is clicked', async () => {
    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
    );
    const button = getByText('API-DOC');
    expect(button.getAttribute('href')).toContain('/api-doc');
  });
  test('calls goTo function when "Friends" is clicked', async () => {
    const goToMock = jest.fn();
    const { getAllByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
    );
    fireEvent.click(getAllByText('Friends')[0]);
    await waitFor(() => {
      expect(goToMock).toHaveBeenCalledTimes(1);
    });
  });



  
  test('calls goTo function when "Logout" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
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
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider value={{ sessionData: sessionDataMock }}>
        <Nav changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
    );
  
    // Verifica que el nombre de usuario se muestre correctamente en el componente
    expect(getByText('noUser')).toBeInTheDocument();
  });

  test('calls goToMenuClic when the button "Menu" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
      );
    const button = getByText('Menu');

    fireEvent.click(button);

    expect(goToMock).toHaveBeenCalled();
  });

  test('calls goToMenuClic when the button "ASW WIQ" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
      );
    const button = getByText('ASW WIQ');

    fireEvent.click(button);

    expect(goToMock).toHaveBeenCalled();
  });

  test('calls goToMenuClic when the button "Volver al menú" is clicked', async () => {
    const goToMock = jest.fn();
    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Nav goTo={goToMock} changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
      </SessionProvider></IntlProvider>
      );
    const button = getByText('Back to menu');

    fireEvent.click(button);

    expect(goToMock).toHaveBeenCalled();
  });

  test('shows the username of de user account in nav', () => {

    const storedData = { username: 'testUser' };
    localStorage.setItem('sessionData', JSON.stringify(storedData));

    const TestComponent = () => {
      const { sessionData } = React.useContext(SessionContext);
      return <Nav changeLanguage={mockChangeLanguage} locale={'en'} isInGame={true} />
    };

    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <TestComponent />
      </SessionProvider></IntlProvider>
    );

    expect(getByText('testUser')).toBeInTheDocument();
  });
});
