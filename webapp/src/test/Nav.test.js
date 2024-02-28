import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from '../components/Nav';

describe('Nav component', () => {
  test('renders Nav component correctly', () => {
    const mockGoTo = jest.fn();
    render(<Nav goTo={mockGoTo} />);
    
    
  });
});
