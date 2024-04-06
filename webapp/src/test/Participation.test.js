import React from 'react';
import { render, screen } from '@testing-library/react';
import { Participation } from '../components/Participation';
import { SessionContext } from '../SessionContext';

describe('Participation component', () => {
  test('renders correctly', () => {
    const sessionData = {
      userId: 'mockedUserId',
      username: 'mockusername',
      createdAt: new Date('2024-01-01'), 
      token: 'mockToken',
      profileImage: 'mockimg.jpg', 
    };

    render(
      <SessionContext.Provider value={{ sessionData }}>
        <Participation goTo={(parameter) => {}} />
      </SessionContext.Provider>
    );

    // Verificar que el texto "Participation" se muestra correctamente
    const participationText = screen.getAllByText(/Participación/i);
    expect(participationText.length).toBeGreaterThan(0);
  });
});