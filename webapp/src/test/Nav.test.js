import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from '../components/Nav';

describe('Nav component', () => {
  test('renders Nav component correctly', () => {
    const mockGoTo = jest.fn();
    render(<Nav goTo={mockGoTo} />);
    
    // Verifica que los elementos del Nav se rendericen correctamente
    expect(screen.getByText('Volver al Menú')).toBeInTheDocument();
    expect(screen.getByAltText('Remy Sharp')).toBeInTheDocument();

    // Simula hacer clic en el botón de menú
    fireEvent.click(screen.getByLabelText('account of current user'));
    // Verifica que se abra el menú
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Simula hacer clic en el botón de "Volver al Menú"
    fireEvent.click(screen.getByText('Volver al Menú'));
    // Verifica que la función goTo haya sido llamada con el parámetro correcto
    expect(mockGoTo).toHaveBeenCalledWith(1);

    // Simula hacer clic en el botón de "Logout"
    fireEvent.click(screen.getByText('Logout'));
    // Verifica que la función goTo haya sido llamada con el parámetro correcto
    expect(mockGoTo).toHaveBeenCalledWith(0);
  });
});
