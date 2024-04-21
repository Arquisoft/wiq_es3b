import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Participation } from '../components/Participation';
import { SessionContext } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

jest.mock('axios');

const sessionData = {
  userId: 'mockedUserId',
  username: 'mockusername',
  createdAt: new Date('2024-01-01'), 
  token: 'mockToken',
  profileImage: 'mockimg.jpg', 
};

describe('Participation component', () => {
  test('renders correctly', () => {

    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData }}>
        <Participation goTo={(parameter) => {}} />
      </SessionContext.Provider></IntlProvider>
    );

    // Verificar que el texto "Participation" se muestra correctamente
    const participationText = screen.getAllByText(/Participación/i);
    expect(participationText.length).toBeGreaterThan(0);
  });

  test('renders participation data after loading', async () => {
    const mockParticipationData = {
      totalGames: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      totalTime: 300,
    };

    axios.get.mockResolvedValueOnce({ data: mockParticipationData }); // Mock para simular respuesta con datos de participación

    const { getByText } = render(<IntlProvider locale={"en"} messages={messages_en}><SessionContext.Provider value={{ sessionData }}>
      <Participation /></SessionContext.Provider></IntlProvider>);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(getByText(`Número de partidas jugadas: ${mockParticipationData.totalGames}`)).toBeInTheDocument();
      expect(getByText(`Preguntas acertadas: ${mockParticipationData.correctAnswers}`)).toBeInTheDocument();
      expect(getByText(`Preguntas falladas: ${mockParticipationData.incorrectAnswers}`)).toBeInTheDocument();
      expect(getByText(`Tiempo total jugando: ${mockParticipationData.totalTime} segundos`)).toBeInTheDocument();
    });
  });
});