const request = require('supertest');
const Game = require('./game-model');
const app = require('./game-service');

jest.mock('./game-model');

describe('Game Service', () => {
  // Test para agregar un nuevo juego con éxito
  it('should add a new game on POST /addgame', async () => {
    const newGame = {
      user: 'testuser',
      pAcertadas: 5,
      pFalladas: 3,
      totalTime: 1200,
    };


    Game.prototype.save.mockResolvedValue(newGame);

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newGame);
  });

  // Test para manejar el error al agregar un nuevo juego
  it('should handle internal server error when adding a new game', async () => {
    const errorMessage = 'Internal Server Error';
    Game.prototype.save.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).post('/addgame').send({
      user: 'testuser',
      pAcertadas: 5,
      pFalladas: 3,
      totalTime: 1200,
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });

  // Test para obtener los datos de participación de un usuario existente
  it('should return participation data for existing user', async () => {
    const userId = 'existingUserId';

    const mockParticipationData = {
      _id: null,
      totalGames: 10,
      correctAnswers: 50,
      incorrectAnswers: 20,
      totalTime: 3600,
    };

    Game.aggregate.mockResolvedValue([mockParticipationData]);

    const response = await request(app).get(`/getParticipation/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockParticipationData);
  });

  // Test para manejar el error al obtener los datos de participación
  it('should handle internal server error when getting participation data', async () => {
    const userId = 'existingUserId';

    const errorMessage = 'Internal Server Error';
    Game.aggregate.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get(`/getParticipation/${userId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });

  // Test para manejar el caso de usuario no encontrado al obtener los datos de participación
  it('should return 404 when getting participation data for non-existent user', async () => {
    const nonExistentUserId = 'nonExistentUserId';

    Game.aggregate.mockResolvedValue([]);

    const response = await request(app).get(`/getParticipation/${nonExistentUserId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No participation data found for the user.' });
  });
});