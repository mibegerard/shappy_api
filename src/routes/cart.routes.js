const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Import middleware
const { protectWithToken, ensureRestaurateurRole, verifyUser } = require("../middlewares/auth.middleware");

// Import controller functions
const {
    createCart,
    getCart,
    getProductDetailsInCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart,
    getTotalPrice,
    checkoutCart,
    createStripeCheckoutSession,
    getStripeSessionStatus,
    addProductToCartFromDetails
} = require('../controllers/cart.controller');

/*******************************************************************
 * @desc                Create a new cart
 * @route               POST /cart/:user_id
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.post('/cart/:user_id', protectWithToken, ensureRestaurateurRole, verifyUser, createCart);

/*******************************************************************
 * @desc                Get the cart details
 * @route               GET /cart/:user_id
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.get('/cart/:user_id', protectWithToken, ensureRestaurateurRole, verifyUser, getCart);

/*******************************************************************
 * @desc                Get the product in cart details
 * @route               GET /cart/:user_id/product/:product_id
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.get('/cart/:user_id/product/:product_id', protectWithToken, ensureRestaurateurRole, getProductDetailsInCart);

/*******************************************************************
 * @desc                Add a product to the cart
 * @route               POST /cart/:user_id/product
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.post('/cart/:user_id/product', protectWithToken, ensureRestaurateurRole, verifyUser, addProductToCart);

/*******************************************************************
 * @desc                Add a product to the cart From Product Details
 * @route               POST /cart/:user_id/product
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.post('/cart/:user_id/productDetails', protectWithToken, ensureRestaurateurRole, verifyUser, addProductToCartFromDetails);

/*******************************************************************
 * @desc                Update product quantity in the cart
 * @route               PUT /cart/:user_id/product
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.put('/cart/:user_id/product', protectWithToken, ensureRestaurateurRole, verifyUser, updateProductQuantity);

/*******************************************************************
 * @desc                Remove a product from the cart
 * @route               DELETE /cart/:user_id/product/:product_id
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.delete('/cart/:user_id/product/:product_id', protectWithToken, ensureRestaurateurRole, verifyUser, removeProductFromCart);

/*******************************************************************
 * @desc                Clear the cart
 * @route               DELETE /cart/:user_id
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.delete('/cart/:user_id', protectWithToken, ensureRestaurateurRole, verifyUser, clearCart);

/*******************************************************************
 * @desc                Get total price of the cart
 * @route               GET /cart/:user_id/total
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.get('/cart/:user_id/total', protectWithToken, ensureRestaurateurRole, verifyUser, getTotalPrice);

/*******************************************************************
 * @desc                Checkout the cart (empty the cart after)
 * @route               POST /cart/:user_id/checkout
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.post('/cart/:user_id/checkout', protectWithToken, ensureRestaurateurRole, verifyUser, checkoutCart);

/*******************************************************************
 * @desc                Get Stripe Checkout session status
 * @route               GET /cart/session-status
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.get(
    '/cart/stripe/session-status',
    protectWithToken,
    ensureRestaurateurRole,
    verifyUser,
    getStripeSessionStatus
);

/*******************************************************************
 * @desc                Create a Stripe Checkout session
 * @route               POST /cart/checkout-session
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
router.post(
    '/cart/stripe/checkout-session',
    protectWithToken,
    ensureRestaurateurRole,
    verifyUser,
    createStripeCheckoutSession
);

module.exports = router;