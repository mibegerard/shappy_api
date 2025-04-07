const assert = require('assert');
const CartController = require('../controllers/cart.controller');
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');
const RestaurateurUserModel = require('../models/restaurateur.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

jest.mock('../models/cart.model');
jest.mock('../models/product.model');
jest.mock('../models/restaurateur.model');
jest.mock('stripe');

describe('Cart Controller', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('createCart - should create a new cart for a restaurateur', async () => {
		const req = { params: { user_id: '123' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		RestaurateurUserModel.findById.mockResolvedValue({ _id: '123' });
		CartModel.prototype.save = jest.fn().mockResolvedValue({ restaurateur: '123', products: [], totalPrice: 0 });

		await CartController.createCart(req, res);

		expect(RestaurateurUserModel.findById).toHaveBeenCalledWith('123');
		expect(CartModel.prototype.save).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ restaurateur: '123', products: [], totalPrice: 0 });
	});

	test('getCart - should retrieve a cart for a restaurateur', async () => {
		const req = { params: { user_id: '123' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({
			restaurateur: '123',
			products: [{ product: { name: 'Product 1', price: 10 }, quantity: 2 }],
			totalPrice: 20,
		});

		await CartController.getCart(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			restaurateur: '123',
			products: [{ product: { name: 'Product 1', price: 10 }, quantity: 2 }],
			totalPrice: 20,
		});
	});

	test('getProductDetailsInCart - should retrieve product details in a cart', async () => {
		const req = { params: { user_id: '123', product_id: '456' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({
			products: [
				{
					product: { _id: '456', name: 'Product 1', price: 10, producteur: { firstName: 'John', lastName: 'Doe' } },
					quantity: 2,
					totalPrice: 20,
				},
			],
		});

		await CartController.getProductDetailsInCart(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			product: { _id: '456', name: 'Product 1', price: 10, producteur: { firstName: 'John', lastName: 'Doe' } },
			quantity: 2,
			totalPrice: 20,
			producteur: { firstName: 'John', lastName: 'Doe' },
		});
	});

	test('addProductToCart - should add a product to the cart', async () => {
		const req = { params: { user_id: '123' }, body: { productId: '456', quantity: 2 } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		RestaurateurUserModel.findById.mockResolvedValue({ _id: '123' });
		ProductModel.findById.mockResolvedValue({ _id: '456', price: 10 });
		CartModel.findOne.mockResolvedValue({
			restaurateur: '123',
			products: [],
			totalPrice: 0,
			save: jest.fn().mockResolvedValue(true),
		});

		await CartController.addProductToCart(req, res);

		expect(RestaurateurUserModel.findById).toHaveBeenCalledWith('123');
		expect(ProductModel.findById).toHaveBeenCalledWith('456');
		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalled();
	});

	test('updateProductQuantity - should update product quantity in the cart', async () => {
		const req = { params: { user_id: '123' }, body: { productId: '456', quantity: 3 } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({
			restaurateur: '123',
			products: [{ product: '456', quantity: 2, price: 10, totalPrice: 20 }],
			totalPrice: 20,
			save: jest.fn().mockResolvedValue(true),
		});

		await CartController.updateProductQuantity(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalled();
	});

	test('removeProductFromCart - should remove a product from the cart', async () => {
		const req = { params: { user_id: '123', product_id: '456' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({
			restaurateur: '123',
			products: [{ product: '456', quantity: 2, price: 10, totalPrice: 20 }],
			totalPrice: 20,
			save: jest.fn().mockResolvedValue(true),
		});

		await CartController.removeProductFromCart(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalled();
	});

	test('clearCart - should clear the cart', async () => {
		const req = { params: { user_id: '123' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({
			restaurateur: '123',
			products: [{ product: '456', quantity: 2, price: 10, totalPrice: 20 }],
			totalPrice: 20,
			save: jest.fn().mockResolvedValue(true),
		});

		await CartController.clearCart(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalled();
	});

	test('getTotalPrice - should retrieve the total price of the cart', async () => {
		const req = { params: { user_id: '123' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({ totalPrice: 50 });

		await CartController.getTotalPrice(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ totalPrice: 50 });
	});

	test('checkoutCart - should checkout the cart', async () => {
		const req = { params: { user_id: '123' } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		CartModel.findOne.mockResolvedValue({
			restaurateur: '123',
			products: [{ product: '456', quantity: 2, price: 10, totalPrice: 20 }],
			totalPrice: 20,
			save: jest.fn().mockResolvedValue(true),
		});

		await CartController.checkoutCart(req, res);

		expect(CartModel.findOne).toHaveBeenCalledWith({ restaurateur: '123' });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalled();
	});

	test('getStripeSessionStatus - should retrieve Stripe session status', async () => {
		const req = { query: { session_id: 'session_123' } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

		stripe.checkout.sessions.retrieve.mockResolvedValue({
			status: 'complete',
			customer_details: { email: 'test@example.com' },
		});

		await CartController.getStripeSessionStatus(req, res);

		expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith('session_123');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			status: 'complete',
			customer_email: 'test@example.com',
		});
	});

	test('createStripeCheckoutSession - should create a Stripe checkout session', async () => {
		const req = { body: { priceId: 'price_123', quantity: 2 } };
		const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

		stripe.checkout.sessions.create.mockResolvedValue({ client_secret: 'secret_123' });

		await CartController.createStripeCheckoutSession(req, res);

		expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
			ui_mode: 'embedded',
			line_items: [{ price: 'price_123', quantity: 2 }],
			mode: 'payment',
			return_url: `${process.env.ORIGIN}/return?session_id={CHECKOUT_SESSION_ID}`,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({ clientSecret: 'secret_123' });
	});
});

test('getTotalPrice', () => {
	 
});

test('checkoutCart', () => {
	 
});

test('getStripeSessionStatus', () => {
	 
});

test('createStripeCheckoutSession', () => {
	 
});