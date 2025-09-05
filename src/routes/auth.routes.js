const express = require("express");
const {
    registerAsRestaurateur,
    registerAsProducteur,
    login,
    logout,
    resendVerificationEmail
} = require("../controllers/auth.controller");
const {
    validatePassword,
    protectWithToken,
    verifyAndGetUser,
    verifyEmail,
    checkEmailVerificationStatus
} = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register/restaurateur:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur restaurateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur restaurateur créé
 *       400:
 *         description: Erreur de validation
 */
router.post('/auth/register/restaurateur', registerAsRestaurateur);

/**
 * @swagger
 * /api/auth/register/producteur:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur producteur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur producteur créé
 *       400:
 *         description: Erreur de validation
 */
router.post('/auth/register/producteur', registerAsProducteur);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur (restaurateur ou producteur)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post('/auth/login', validatePassword, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/auth/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/auth/me', protectWithToken, verifyAndGetUser);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Vérifier l'email de l'utilisateur
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Jeton de vérification
 *     responses:
 *       200:
 *         description: Email vérifié
 *       400:
 *         description: Jeton invalide
 */
router.get('/auth/verify-email', verifyEmail);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Renvoyer l'email de vérification
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de vérification renvoyé
 *       400:
 *         description: Erreur
 */
router.post('/auth/resend-verification', resendVerificationEmail);

/**
 * @swagger
 * /api/auth/verification-status:
 *   post:
 *     summary: Vérifier le statut de vérification de l'utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut de vérification retourné
 *       400:
 *         description: Erreur
 */
router.post('/auth/verification-status', checkEmailVerificationStatus);

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Vérifier l'email via un token dans l'URL
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Jeton de vérification
 *     responses:
 *       200:
 *         description: Email vérifié
 *       400:
 *         description: Jeton invalide
 */
router.get('/verify-email/:token', verifyEmail);

module.exports = router;