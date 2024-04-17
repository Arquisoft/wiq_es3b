import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import User from '../components/User';
import { SessionProvider } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

const mockChangeLanguage = jest.fn();

describe('User component', () => {
  test('renders login form by default', () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <User goTo={(parameter) => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionProvider></IntlProvider>
    );
    
    // Verificar que el texto de bienvenida se muestra correctamente
    const welcomeText = screen.getByText(/ASW - WIQ Quiz/i);
    expect(welcomeText).toBeInTheDocument();

    const welcomeText2 = screen.getByText(/> Login/i);
    expect(welcomeText2).toBeInTheDocument();

    // Verificar que el formulario de inicio de sesión se muestra por defecto
    const loginForm = screen.getByRole('textbox', { name: /username/i });
    expect(loginForm).toBeInTheDocument();

    // Verificar que el enlace para registrar se muestra correctamente
    const registerLink = screen.getByRole('button', { name: /register here/i });
    expect(registerLink).toBeInTheDocument();
  });

  test('toggling between login and registration form works correctly', () => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <User goTo={(parameter) => {}} changeLanguage={mockChangeLanguage} locale={'en'} />
      </SessionProvider></IntlProvider>
    );
    
    // Verificar que el enlace para registrar está presente
    const registerLink = screen.getByRole('button', { name: /register here/i });
    expect(registerLink).toBeInTheDocument();

    // Simular clic en el enlace para registrar
    fireEvent.click(registerLink);

    // Verificar que el enlace para iniciar sesión se muestra después de hacer clic en el enlace de registro
    const loginLink = screen.getByRole('button', { name: /login here/i });
    expect(loginLink).toBeInTheDocument();

    // Simular clic en el enlace para iniciar sesión
    fireEvent.click(loginLink);

    // Verificar que el formulario de inicio de sesión se muestra nuevamente después de hacer clic en el enlace de inicio de sesión
    const loginForm = screen.getByRole('textbox', { name: /username/i });
    expect(loginForm).toBeInTheDocument();
  });
});
