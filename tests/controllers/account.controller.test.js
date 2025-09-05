const request = require('supertest');
const app = require('../../src/app');
const RestaurateurUserModel = require('../../src/models/restaurateur.model');
const ProducteurUserModel = require('../../src/models/producteur.model');
const ProductModel = require('../../src/models/product.model');

jest.mock('../../src/models/restaurateur.model');
jest.mock('../../src/models/producteur.model');
jest.mock('../../src/models/product.model');
jest.mock('../../src/middlewares/auth.middleware', () => ({
  protectWithToken: (req, res, next) => {
    req.user = { id: '123', role: 'restaurateur' };
    next();
  },
  validatePassword: (req, res, next) => next(),
  verifyAndGetUser: (req, res, next) => next(),
  verifyEmail: (req, res, next) => next(),
  checkEmailVerificationStatus: (req, res, next) => next(),
  ensureProducteurRole: (req, res, next) => next(),
  ensureRestaurateurRole: (req, res, next) => next(),
  verifyUser: (req, res, next) => next(),
}));
jest.mock('../../src/middlewares/uploadImage.middleware', () => () => (req, res, next) => {
  if (req.body && req.body.profilePicture) {
    req.file = {
      filename: req.body.profilePicture
    };
  }
  next();
});

describe('Account Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/:id/profile-picture', () => {
        it('met à jour la photo de profil', async () => {
            RestaurateurUserModel.findByIdAndUpdate.mockResolvedValue({
                toObject: () => ({ _id: 'id', profilePicture: 'img.png', password: 'secret' })
            });

            const res = await request(app)
                .post('/api/123/profile-picture')
                .set('Authorization', 'Bearer fake-jwt')
                .send({ role: 'restaurateur', profilePicture: 'img.png' });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('retourne une erreur si la photo est manquante', async () => {
            const res = await request(app)
                .post('/api/123/profile-picture')
                .send({ role: 'restaurateur' });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/:id/profile-picture', () => {
        it('récupère la photo de profil', async () => {
            RestaurateurUserModel.findById.mockResolvedValue({ profilePicture: 'img.png' });

            const res = await request(app)
                .get('/api/123/profile-picture?role=restaurateur')
                .set('Authorization', 'Bearer fake-jwt');

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toBe('img.png');
        });

        it('retourne 404 si utilisateur introuvable', async () => {
            RestaurateurUserModel.findById.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/123/profile-picture?role=restaurateur');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /api/:id/description', () => {
        it('met à jour la description', async () => {
            RestaurateurUserModel.findByIdAndUpdate.mockResolvedValue({
                toObject: () => ({ _id: 'id', description: 'desc', password: 'secret' })
            });

            const res = await request(app)
                .post('/api/123/description')
                .set('Authorization', 'Bearer fake-jwt')
                .send({ role: 'restaurateur', description: 'desc' });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('GET /api/:id/description', () => {
        it('récupère la description', async () => {
            RestaurateurUserModel.findById.mockResolvedValue({ description: 'desc' });

            const res = await request(app)
                .get('/api/123/description?role=restaurateur')
                .set('Authorization', 'Bearer fake-jwt');

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toBe('desc');
        });
    });

    describe('DELETE /api/:id/profile-picture', () => {
        it('supprime la photo de profil', async () => {
            RestaurateurUserModel.findByIdAndUpdate.mockResolvedValue({
                toObject: () => ({ _id: 'id', profilePicture: null, password: 'secret' })
            });

            const res = await request(app)
                .delete('/api/123/profile-picture')
                .set('Authorization', 'Bearer fake-jwt')
                .send({ role: 'restaurateur' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/deleted|supprimée/i);
        });
    });

    describe('DELETE /api/:id/description', () => {
        it('supprime la description', async () => {
            RestaurateurUserModel.findByIdAndUpdate.mockResolvedValue({
                toObject: () => ({ _id: 'id', description: null, password: 'secret' })
            });

            const res = await request(app)
                .delete('/api/123/description')
                .set('Authorization', 'Bearer fake-jwt')
                .send({ role: 'restaurateur' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/deleted|supprimée/i);
        });
    });

    describe('PUT /api/restaurateurs/update', () => {
        it('met à jour un restaurateur', async () => {
            RestaurateurUserModel.findOneAndUpdate.mockResolvedValue({
                toObject: () => ({ _id: 'id', name: 'resto', password: 'secret' })
            });

            const res = await request(app)
                .put('/api/restaurateurs/update')
                .send({ property: 'name', updateData: { name: 'resto' } })
                .set('Authorization', 'Bearer fake-jwt');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('PUT /api/producteurs/update', () => {
        it('met à jour un producteur', async () => {
            ProducteurUserModel.findOneAndUpdate.mockResolvedValue({
                toObject: () => ({ _id: 'id', name: 'prod', password: 'secret' })
            });

            const res = await request(app)
                .put('/api/producteurs/update')
                .send({ property: 'name', updateData: { name: 'prod' } })
                .set('Authorization', 'Bearer fake-jwt');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

        describe('GET /api/products/user/:userId', () => {
        it('récupère les produits d\'un utilisateur', async () => {
            ProductModel.find.mockReturnValue({
                populate: () => ({
                    sort: () => ({
                        skip: () => ({
                            limit: () => [{ name: 'p1' }, { name: 'p2' }]
                        })
                    })
                })
            });
            ProductModel.countDocuments.mockResolvedValue(2);
    
            const res = await request(app)
                .get('/api/products/user/123?page=1&limit=10');
    
            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.data.length).toBe(2);
        });
    });
});