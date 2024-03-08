const request = require('supertest');
let app;

beforeAll(async () => {
  app = require('./questionGenerationService'); 
});

afterAll(async () => {
    app.close();
});

describe('Question generation service', () => {
  it('should forward create question request to question generation service', async () => {
    const response = await request(app)
      .get('/api/questions/create');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },100000);

  it('should forward create question request to question generation service', async () => {
    const response = await request(app)
      .get('/api/questions/create?category=sports');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },100000);

  it('should forward create question request to question generation service', async () => {
    const response = await request(app)
      .get('/api/questions/create?category=geography');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('correct');
    expect(response.body).toHaveProperty('incorrects');
  },100000);
});
