import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import User from '../components/User';

describe('User component', () => {
  test('renders login form by default', () => {
    render(<User goTo={(parameter) => {}} />);
    
    // Verificar que el texto de bienvenida se muestra correctamente
    const welcomeText = screen.getByText(/Welcome to the 2024 edition of the Software Architecture course/i);
    expect(welcomeText).toBeInTheDocument();

    const welcomeText2 = screen.getByText(/Login :D/i);
    expect(welcomeText2).toBeInTheDocument();

    // Verificar que el formulario de inicio de sesión se muestra por defecto
    const loginForm = screen.getByRole('textbox', { name: /username/i });
    expect(loginForm).toBeInTheDocument();

    // Verificar que el enlace para registrar se muestra correctamente
    const registerLink = screen.getByRole('button', { name: /register here/i });
    expect(registerLink).toBeInTheDocument();
  });

  test('toggling between login and registration form works correctly', () => {
    render(<User goTo={(parameter) => {}} />);
    
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
