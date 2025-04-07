const assert = require('assert');
const accountController = require('../controllers/account.controller');

describe('Account Controller', () => {
    test('postProfilePicture', async () => {
        const req = { body: { image: 'base64ImageString' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.postProfilePicture(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('getProfilePicture', async () => {
        const req = { params: { userId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.getProfilePicture(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ image: expect.any(String) });
    });

    test('postDescription', async () => {
        const req = { body: { description: 'New description' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.postDescription(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('getDescription', async () => {
        const req = { params: { userId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.getDescription(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ description: expect.any(String) });
    });

    test('deleteProfilePicture', async () => {
        const req = { params: { userId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.deleteProfilePicture(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('deleteDescription', async () => {
        const req = { params: { userId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.deleteDescription(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('updateRestaurateurProfile', async () => {
        const req = { body: { name: 'New Name', address: 'New Address' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.updateRestaurateurProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('updateProducteurProfile', async () => {
        const req = { body: { name: 'New Name', farm: 'New Farm' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.updateProducteurProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('getProductsByUserId', async () => {
        const req = { params: { userId: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await accountController.getProductsByUserId(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ products: expect.any(Array) });
    });
});