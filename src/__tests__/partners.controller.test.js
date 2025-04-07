const PartnersController = require('../controllers/partners.controller');
const RestaurateurUserModel = require('../models/restaurateur.model');
const ProducteurUserModel = require('../models/producteur.model');
const { omit } = require('lodash');
const ErrorResponse = require('../helper/errorResponse');

jest.mock('../models/restaurateur.model');
jest.mock('../models/producteur.model');

describe('Partners Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Restaurateurs', () => {
        test('getAllRestaurateurs - should return all restaurateurs', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            RestaurateurUserModel.find.mockResolvedValue([
                { _id: '1', name: 'Restaurateur 1', password: 'secret' },
                { _id: '2', name: 'Restaurateur 2', password: 'secret' },
            ]);

            await PartnersController.getAllRestaurateurs(req, res);

            expect(RestaurateurUserModel.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 2,
                data: [
                    { _id: '1', name: 'Restaurateur 1' },
                    { _id: '2', name: 'Restaurateur 2' },
                ],
            });
        });

        test('getRestaurateurByProperty - should return a restaurateur by property', async () => {
            const req = { query: { property: 'name', value: 'Restaurateur 1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            RestaurateurUserModel.findOne.mockResolvedValue({
                _id: '1',
                name: 'Restaurateur 1',
                password: 'secret',
            });

            await PartnersController.getRestaurateurByProperty(req, res, next);

            expect(RestaurateurUserModel.findOne).toHaveBeenCalledWith({ name: 'Restaurateur 1' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { _id: '1', name: 'Restaurateur 1' },
            });
        });

        test('deleteRestaurateurById - should delete a restaurateur by ID', async () => {
            const req = { params: { id: '1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            RestaurateurUserModel.findByIdAndDelete.mockResolvedValue({ _id: '1', name: 'Restaurateur 1' });

            await PartnersController.deleteRestaurateurById(req, res, next);

            expect(RestaurateurUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Restaurateur deleted successfully',
            });
        });

        test('updateRestaurateurByProperty - should update a restaurateur by property', async () => {
            const req = {
                body: { property: 'name', value: 'Restaurateur 1', updateData: { name: 'Updated Name' } },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            RestaurateurUserModel.findOneAndUpdate.mockResolvedValue({
                _id: '1',
                name: 'Updated Name',
                password: 'secret',
            });

            await PartnersController.updateRestaurateurByProperty(req, res, next);

            expect(RestaurateurUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { name: 'Restaurateur 1' },
                { name: 'Updated Name' },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { _id: '1', name: 'Updated Name' },
            });
        });
    });

    describe('Producteurs', () => {
        test('getAllProducteurs - should return all producteurs', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            ProducteurUserModel.find.mockResolvedValue([
                { _id: '1', name: 'Producteur 1', password: 'secret' },
                { _id: '2', name: 'Producteur 2', password: 'secret' },
            ]);

            await PartnersController.getAllProducteurs(req, res);

            expect(ProducteurUserModel.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 2,
                data: [
                    { _id: '1', name: 'Producteur 1' },
                    { _id: '2', name: 'Producteur 2' },
                ],
            });
        });

        test('getProducteurByProperty - should return a producteur by property', async () => {
            const req = { query: { property: 'name', value: 'Producteur 1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            ProducteurUserModel.findOne.mockResolvedValue({
                _id: '1',
                name: 'Producteur 1',
                password: 'secret',
            });

            await PartnersController.getProducteurByProperty(req, res, next);

            expect(ProducteurUserModel.findOne).toHaveBeenCalledWith({ name: 'Producteur 1' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { _id: '1', name: 'Producteur 1' },
            });
        });

        test('deleteProducteurById - should delete a producteur by ID', async () => {
            const req = { params: { id: '1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            ProducteurUserModel.findByIdAndDelete.mockResolvedValue({ _id: '1', name: 'Producteur 1' });

            await PartnersController.deleteProducteurById(req, res, next);

            expect(ProducteurUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Producteur deleted successfully',
            });
        });

        test('updateProducteurByProperty - should update a producteur by property', async () => {
            const req = {
                body: { property: 'name', value: 'Producteur 1', updateData: { name: 'Updated Name' } },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            ProducteurUserModel.findOneAndUpdate.mockResolvedValue({
                _id: '1',
                name: 'Updated Name',
                password: 'secret',
            });

            await PartnersController.updateProducteurByProperty(req, res, next);

            expect(ProducteurUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { name: 'Producteur 1' },
                { name: 'Updated Name' },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { _id: '1', name: 'Updated Name' },
            });
        });
    });
});