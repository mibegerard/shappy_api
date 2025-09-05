const request = require('supertest');
const app = require('../../src/app'); // Assurez-vous que votre app exporte l'instance Express
const RestaurateurUserModel = require('../../src/models/restaurateur.model');
const ProducteurUserModel = require('../../src/models/producteur.model');
const sendEmail = require('../../src/helper/sendEmail');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/restaurateur.model');
jest.mock('../../src/models/producteur.model');
jest.mock('../../src/helper/sendEmail');

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register/restaurateur', () => {
        it('doit enregistrer un restaurateur et envoyer un email', async () => {
            RestaurateurUserModel.findOne.mockResolvedValue(null);
            ProducteurUserModel.findOne.mockResolvedValue(null);
            RestaurateurUserModel.prototype.save = jest.fn().mockResolvedValue();
            RestaurateurUserModel.prototype.generateVerificationToken = jest.fn().mockReturnValue('token');
            sendEmail.mockResolvedValue();

            const res = await request(app)
                .post('/api/auth/register/restaurateur')
                .send({
                    email: 'test@restaurateur.com',
                    password: 'Password123!',
                    firstName: 'Test',
                    lastName: 'User',
                    city: 'Paris',
                    postalCode: '75000',
                    phoneNumber: '0600000000',
                    restaurantName: 'Le Test',
                    restaurantAddress: '1 rue du Test'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(sendEmail).toHaveBeenCalled();
        });

        it('doit refuser un email déjà existant', async () => {
            RestaurateurUserModel.findOne.mockResolvedValue({ email: 'test@restaurateur.com' });

            const res = await request(app)
                .post('/api/auth/register/restaurateur')
                .send({
                    email: 'test@restaurateur.com',
                    password: 'Password123!',
                    firstName: 'Test',
                    lastName: 'User',
                    city: 'Paris',
                    postalCode: '75000',
                    phoneNumber: '0600000000',
                    restaurantName: 'Le Test',
                    restaurantAddress: '1 rue du Test'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBeFalsy();
        });
    });

    describe('POST /api/auth/register/producteur', () => {
        it('doit enregistrer un producteur et envoyer un email', async () => {
            RestaurateurUserModel.findOne.mockResolvedValue(null);
            ProducteurUserModel.findOne.mockResolvedValue(null);
            ProducteurUserModel.prototype.save = jest.fn().mockResolvedValue();
            ProducteurUserModel.prototype.generateVerificationToken = jest.fn().mockReturnValue('token');
            sendEmail.mockResolvedValue();

            const res = await request(app)
                .post('/api/auth/register/producteur')
                .send({
                    email: 'test@producteur.com',
                    password: 'Password123!',
                    firstName: 'Test',
                    lastName: 'User',
                    city: 'Lyon',
                    postalCode: '69000',
                    phoneNumber: '0600000001',
                    products: []
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(sendEmail).toHaveBeenCalled();
        });
    });

    describe('POST /api/auth/login', () => {
        it('doit refuser une connexion avec mauvais credentials', async () => {
            RestaurateurUserModel.findOne.mockResolvedValue(null);
            ProducteurUserModel.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrong@mail.com', password: 'wrong' });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBeFalsy();
        });
    });

    describe('POST /api/auth/logout', () => {
        it('doit déconnecter l\'utilisateur', async () => {
            const res = await request(app)
                .post('/api/auth/logout');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
    
    describe('POST /api/auth/resend-verification', () => {
        it('doit renvoyer un email de vérification', async () => {
            RestaurateurUserModel.findOne.mockResolvedValue({
                email: 'test@restaurateur.com',
                generateVerificationToken: jest.fn().mockReturnValue('token')
            });
            sendEmail.mockResolvedValue();
        
            const res = await request(app)
                .post('/api/auth/resend-verification')
                .send({ email: 'test@restaurateur.com' });
        
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(sendEmail).toHaveBeenCalled();
        });
    
        it('doit retourner une erreur si l\'utilisateur est introuvable', async () => {
            RestaurateurUserModel.findOne.mockResolvedValue(null);
    
            const res = await request(app)
                .post('/api/auth/resend-verification')
                .send({ email: 'notfound@mail.com' });
    
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBeFalsy();
        });
    });
});