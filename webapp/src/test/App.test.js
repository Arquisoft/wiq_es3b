import { render, screen } from '@testing-library/react';
import App from '../App';
import { SessionProvider } from '../SessionContext';

test('renders learn react link', () => {
  render(
    <SessionProvider>
      <App />
    </SessionProvider>
  );

  const linkElement = screen.getByText(/Welcome to the 2024 edition of the Software Architecture course/i);
  expect(linkElement).toBeInTheDocument();
});
