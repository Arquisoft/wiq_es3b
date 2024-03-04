import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Participation } from '../components/Participation';
import Nav from '../components/Nav';

describe('Participation component', () => {
  test('renders correctly', () => {
    render(<Participation goTo={(parameter) => {}} />);

    // Verificar que el texto "Participation" se muestra correctamente
    const titleText = screen.getByText(/Participation/i);
    expect(titleText).toBeInTheDocument();

  });
});
