
const ProductController = require('../controllers/product.controller');
const ProductModel = require('../models/product.model');
const ErrorResponse = require('../helper/errorResponse');
jest.mock('../models/product.model');

describe('Product Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createProduct - should create a new product', async () => {
        const req = {
            body: {
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                quantity: 10,
                category: 'Test Category',
                unit: 'kg',
            },
            file: { path: 'test/image/path.jpg' },
            user: { id: '123', role: 'producteur' },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.prototype.save = jest.fn().mockResolvedValue({
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            quantity: 10,
            category: 'Test Category',
            unit: 'kg',
            image: 'test/image/path.jpg',
            producteur: '123',
        });

        await ProductController.createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                quantity: 10,
                category: 'Test Category',
                unit: 'kg',
                image: 'test/image/path.jpg',
                producteur: '123',
            }),
        });
    });

    test('getAllProducts - should return all products with pagination', async () => {
        const req = { query: { page: 1, limit: 10 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.find.mockResolvedValue([
            { name: 'Product 1', price: 100 },
            { name: 'Product 2', price: 200 },
        ]);
        ProductModel.countDocuments.mockResolvedValue(2);

        await ProductController.getAllProducts(req, res);

        expect(ProductModel.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 2,
            total: 2,
            page: 1,
            totalPages: 1,
            data: expect.arrayContaining([
                expect.objectContaining({ name: 'Product 1', price: 100 }),
                expect.objectContaining({ name: 'Product 2', price: 200 }),
            ]),
        });
    });

    test('getProductById - should return a product by ID', async () => {
        const req = { params: { id: '123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.findById.mockResolvedValue({
            _id: '123',
            name: 'Test Product',
            price: 100,
        });

        await ProductController.getProductById(req, res);

        expect(ProductModel.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                _id: '123',
                name: 'Test Product',
                price: 100,
            }),
        });
    });

    test('getProductByName - should return a product by name', async () => {
        const req = { params: { name: 'Test Product' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.findOne.mockResolvedValue({
            _id: '123',
            name: 'Test Product',
            price: 100,
        });

        await ProductController.getProductByName(req, res);

        expect(ProductModel.findOne).toHaveBeenCalledWith({ name: 'Test Product' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                _id: '123',
                name: 'Test Product',
                price: 100,
            }),
        });
    });

    test('updateProductById - should update a product by ID', async () => {
        const req = {
            params: { id: '123' },
            body: { name: 'Updated Product' },
            user: { id: '456' },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.findById.mockResolvedValue({
            _id: '123',
            producteur: '456',
        });
        ProductModel.findByIdAndUpdate.mockResolvedValue({
            _id: '123',
            name: 'Updated Product',
        });

        await ProductController.updateProductById(req, res);

        expect(ProductModel.findById).toHaveBeenCalledWith('123');
        expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
            '123',
            { name: 'Updated Product' },
            { new: true, runValidators: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                _id: '123',
                name: 'Updated Product',
            }),
        });
    });

    test('deleteProductById - should delete a product by ID', async () => {
        const req = { params: { id: '123' }, user: { id: '456' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.findById.mockResolvedValue({
            _id: '123',
            producteur: '456',
        });

        await ProductController.deleteProductById(req, res);

        expect(ProductModel.findById).toHaveBeenCalledWith('123');
        expect(ProductModel.deleteOne).toHaveBeenCalledWith({ _id: '123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {},
        });
    });

    test('updateProduct - should update a product by a property', async () => {
        const req = {
            params: { id: '123' },
            body: { property: 'price', updateData: 200 },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProductModel.findOneAndUpdate.mockResolvedValue({
            _id: '123',
            price: 200,
        });

        await ProductController.updateProduct(req, res);

        expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: '123' },
            { price: 200 },
            { new: true, runValidators: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({
                _id: '123',
                price: 200,
            }),
        });
    });
});