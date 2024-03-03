import React from 'react';
import { render, screen } from '@testing-library/react';
import { PostGame } from '../components/PostGame';

describe('PostGame component', () => {
  test('renders "FIN" text correctly', () => {
    render(<PostGame />);

    // Verifica que el texto "FIN" se renderice correctamente
    expect(screen.getByText('FIN')).toBeInTheDocument();
  });
});
