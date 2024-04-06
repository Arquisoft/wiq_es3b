import { render, screen, act, fireEvent } from '@testing-library/react';
import App from '../App';
import { SessionProvider } from '../SessionContext';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockAxios = new MockAdapter(axios);

test('renders learn react link', () => {
  render(
    <SessionProvider>
      <App />
    </SessionProvider>
  );

  const linkElement = screen.getByText(/ASW - WIQ Quiz/i);
  expect(linkElement).toBeInTheDocument();
});

it('cambia de estado de menú al hacer clic en los botones', async () => {
  const { getByText } = render(<SessionProvider><App /></SessionProvider>);

  const usernameInput = screen.getByLabelText(/Username/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole('button', { name: /Login/i });

  mockAxios.onPost('http://localhost:8000/login').reply(200, { createdAt: '2024-01-01T12:34:56Z' });

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(loginButton);
  });

  const nav = screen.getByText(/ASW WIQ/i);
  expect(nav).toBeInTheDocument();
  fireEvent.click(nav);

  // Encuentra los botones de navegación
  const gameButton = getByText('Classic Game');
  const participationButton = getByText('Participation');

  // Comprueba que solo el componente User está visible inicialmente
  expect(gameButton).toBeInTheDocument();
  expect(participationButton).toBeInTheDocument();

  // Simula hacer clic en el botón Start y comprueba que se cambia al componente Start
  fireEvent.click(gameButton);
  expect(gameButton).not.toBeInTheDocument();
  expect(participationButton).not.toBeInTheDocument();
});
