// JavaScript
const request = require('supertest');
const app = require('../app'); // Assurez-vous que cela pointe vers votre application Express
const { mockAuthService } = require('../services/auth.service'); // Exemple de service mocké

jest.mock('../services/auth.service'); // Mock du service d'authentification

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerAsRestaurateur - should register a restaurateur successfully', async () => {
    mockAuthService.registerAsRestaurateur.mockResolvedValue({ success: true });

    const response = await request(app)
      .post('/auth/register/restaurateur')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(mockAuthService.registerAsRestaurateur).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('registerAsProducteur - should register a producteur successfully', async () => {
    mockAuthService.registerAsProducteur.mockResolvedValue({ success: true });

    const response = await request(app)
      .post('/auth/register/producteur')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(mockAuthService.registerAsProducteur).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('login - should log in a user successfully', async () => {
    mockAuthService.login.mockResolvedValue({ token: 'fake-jwt-token' });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('fake-jwt-token');
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('logout - should log out a user successfully', async () => {
    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
  });

  test('resendVerificationEmail - should resend verification email successfully', async () => {
    mockAuthService.resendVerificationEmail.mockResolvedValue({ success: true });

    const response = await request(app)
      .post('/auth/resend-verification')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockAuthService.resendVerificationEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });
});