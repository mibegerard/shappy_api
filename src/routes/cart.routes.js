const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { protectWithToken, ensureRestaurateurRole, verifyUser } = require("../middlewares/auth.middleware");
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

/**
 * @swagger
 * /api/cart/{user_id}:
 *   post:
 *     summary: Créer un nouveau panier pour un utilisateur
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     responses:
 *       201:
 *         description: Panier créé
 */
router.post('/cart/:user_id', protectWithToken, ensureRestaurateurRole, verifyUser, createCart);

/**
 * @swagger
 * /api/cart/{user_id}:
 *   get:
 *     summary: Récupérer le panier d'un utilisateur
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     responses:
 *       200:
 *         description: Détails du panier récupérés
 */
router.get('/cart/:user_id', protectWithToken, ensureRestaurateurRole, verifyUser, getCart);

/**
 * @swagger
 * /api/cart/{user_id}/product/{product_id}:
 *   get:
 *     summary: Récupérer les détails d'un produit dans le panier
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit dans le panier
 */
router.get('/cart/:user_id/product/:product_id', protectWithToken, ensureRestaurateurRole, getProductDetailsInCart);

/**
 * @swagger
 * /api/cart/{user_id}/product:
 *   post:
 *     summary: Ajouter un produit au panier
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produit ajouté au panier
 */
router.post('/cart/:user_id/product', protectWithToken, ensureRestaurateurRole, verifyUser, addProductToCart);

/**
 * @swagger
 * /api/cart/{user_id}/productDetails:
 *   post:
 *     summary: Ajouter un produit au panier depuis la fiche produit
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produit ajouté au panier depuis la fiche produit
 */
router.post('/cart/:user_id/productDetails', protectWithToken, ensureRestaurateurRole, verifyUser, addProductToCartFromDetails);

/**
 * @swagger
 * /api/cart/{user_id}/product:
 *   put:
 *     summary: Mettre à jour la quantité d'un produit dans le panier
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantité du produit mise à jour
 */
router.put('/cart/:user_id/product', protectWithToken, ensureRestaurateurRole, verifyUser, updateProductQuantity);

/**
 * @swagger
 * /api/cart/{user_id}/product/{product_id}:
 *   delete:
 *     summary: Supprimer un produit du panier
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé du panier
 */
router.delete('/cart/:user_id/product/:product_id', protectWithToken, ensureRestaurateurRole, verifyUser, removeProductFromCart);

/**
 * @swagger
 * /api/cart/{user_id}:
 *   delete:
 *     summary: Vider le panier
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     responses:
 *       200:
 *         description: Panier vidé
 */
router.delete('/cart/:user_id', protectWithToken, ensureRestaurateurRole, verifyUser, clearCart);

/**
 * @swagger
 * /api/cart/{user_id}/total:
 *   get:
 *     summary: Obtenir le prix total du panier
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     responses:
 *       200:
 *         description: Prix total du panier
 */
router.get('/cart/:user_id/total', protectWithToken, ensureRestaurateurRole, verifyUser, getTotalPrice);

/**
 * @swagger
 * /api/cart/{user_id}/checkout:
 *   post:
 *     summary: Valider le panier (checkout)
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur restaurateur
 *     responses:
 *       200:
 *         description: Panier validé et vidé
 */
router.post('/cart/:user_id/checkout', protectWithToken, ensureRestaurateurRole, verifyUser, checkoutCart);

/**
 * @swagger
 * /api/cart/stripe/session-status:
 *   get:
 *     summary: Récupérer le statut de la session Stripe Checkout
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statut de la session Stripe récupéré
 */
router.get(
    '/cart/stripe/session-status',
    protectWithToken,
    ensureRestaurateurRole,
    verifyUser,
    getStripeSessionStatus
);

/**
 * @swagger
 * /api/cart/stripe/checkout-session:
 *   post:
 *     summary: Créer une session Stripe Checkout
 *     tags:
 *       - Panier
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Session Stripe Checkout créée
 */
router.post(
    '/cart/stripe/checkout-session',
    protectWithToken,
    ensureRestaurateurRole,
    verifyUser,
    createStripeCheckoutSession
);

module.exports = router;