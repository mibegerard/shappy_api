const express = require("express");
const {
    postProfilePicture,
    getProfilePicture,
    postDescription,
    getDescription,
    deleteProfilePicture,
    deleteDescription,
    updateProducteurProfile,
    updateRestaurateurProfile,
    getProductsByUserId
} = require("../controllers/account.controller");

const { protectWithToken } = require("../middlewares/auth.middleware");
const uploadImageMiddleware = require('../middlewares/uploadImage.middleware');

const router = express.Router();

/**
 * @swagger
 * {id}/profile-picture:
 *   post:
 *     summary: Ajouter une photo de profil
 *     tags:
 *       - Compte
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         description: Image de profil à télécharger
 *     responses:
 *       200:
 *         description: Photo de profil ajoutée
 */
router.route('/:id/profile-picture').post(protectWithToken, uploadImageMiddleware("profilePicture"),  postProfilePicture);

/**
 * @swagger
 * {id}/profile-picture:
 *   get:
 *     summary: Récupérer la photo de profil d'un utilisateur
 *     tags:
 *       - Compte
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Photo de profil récupérée
 */
router.route('/:id/profile-picture').get(getProfilePicture);

/**
 * @swagger
 * {id}/description:
 *   post:
 *     summary: Ajouter une description utilisateur
 *     tags:
 *       - Compte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Description ajoutée
 */
router.route('/:id/description').post(protectWithToken, postDescription);

/**
 * @swagger
 * {id}/description:
 *   get:
 *     summary: Récupérer la description d'un utilisateur
 *     tags:
 *       - Compte
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Description récupérée
 */
router.route('/:id/description').get(getDescription);

/**
 * @swagger
 * {id}/profile-picture:
 *   delete:
 *     summary: Supprimer la photo de profil d'un utilisateur
 *     tags:
 *       - Compte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Photo de profil supprimée
 */
router.route('/:id/profile-picture').delete(protectWithToken, deleteProfilePicture);

/**
 * @swagger
 * {id}/description:
 *   delete:
 *     summary: Supprimer la description d'un utilisateur
 *     tags:
 *       - Compte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Description supprimée
 */
router.route('/:id/description').delete(protectWithToken, deleteDescription);

/**
 * @swagger
 * /restaurateur/update:
 *   put:
 *     summary: Mettre à jour le profil restaurateur
 *     tags:
 *       - Compte
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
 *         description: Profil restaurateur mis à jour
 */
router.route('/restaurateur/update').put(protectWithToken, updateRestaurateurProfile);

/**
 * @swagger
 * /producteur/update:
 *   put:
 *     summary: Mettre à jour le profil producteur
 *     tags:
 *       - Compte
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
 *         description: Profil producteur mis à jour
 */
router.route('/producteur/update').put(protectWithToken, updateProducteurProfile);

/**
 * @swagger
 * /products/user/{userId}:
 *   get:
 *     summary: Récupérer tous les produits d'un utilisateur
 *     tags:
 *       - Compte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des produits récupérée
 */
router.route('/products/user/:userId').get(protectWithToken, getProductsByUserId);

module.exports = router;