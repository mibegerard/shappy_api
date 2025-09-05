const express = require("express");
const {
    getAllRestaurateurs,
    getRestaurateurByProperty,
    deleteRestaurateurById,
    updateRestaurateurByProperty,
    getAllProducteurs,
    getProducteurByProperty,
    deleteProducteurById,
    updateProducteurByProperty,
} = require("../controllers/partners.controller");
const { protectWithToken } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/restaurateurs:
 *   get:
 *     summary: Récupérer tous les restaurateurs
 *     tags:
 *       - Partenaires
 *     responses:
 *       200:
 *         description: Liste des restaurateurs récupérée
 */
router.route('/restaurateurs').get(getAllRestaurateurs);

/**
 * @swagger
 * /api/restaurateurs/find:
 *   get:
 *     summary: Rechercher un restaurateur par propriété
 *     tags:
 *       - Partenaires
 *     parameters:
 *       - in: query
 *         name: property
 *         schema:
 *           type: string
 *         description: "Propriété à rechercher (ex: email, nom, etc.)"
 *     responses:
 *       200:
 *         description: Restaurateur trouvé
 */
router.route('/restaurateurs/find').get(getRestaurateurByProperty);

/**
 * @swagger
 * /api/restaurateurs/{id}:
 *   delete:
 *     summary: Supprimer un restaurateur par ID
 *     tags:
 *       - Partenaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du restaurateur
 *     responses:
 *       200:
 *         description: Restaurateur supprimé
 */
router.route('/restaurateurs/:id').delete(protectWithToken, deleteRestaurateurById);

/**
 * @swagger
 * /api/restaurateurs/update:
 *   put:
 *     summary: Mettre à jour un restaurateur par propriété
 *     tags:
 *       - Partenaires
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
 *         description: Restaurateur mis à jour
 */
router.route('/restaurateurs/update').put(protectWithToken, updateRestaurateurByProperty);

/**
 * @swagger
 * /api/producteurs:
 *   get:
 *     summary: Récupérer tous les producteurs
 *     tags:
 *       - Partenaires
 *     responses:
 *       200:
 *         description: Liste des producteurs récupérée
 */
router.route('/producteurs').get(getAllProducteurs);

/**
 * @swagger
 * /api/producteurs/find:
 *   get:
 *     summary: Rechercher un producteur par propriété
 *     tags:
 *       - Partenaires
 *     parameters:
 *       - in: query
 *         name: property
 *         schema:
 *           type: string
 *         description: "Propriété à rechercher (ex: email, nom, etc.)"
 *     responses:
 *       200:
 *         description: Producteur trouvé
 */
router.route('/producteurs/find').get(getProducteurByProperty);

/**
 * @swagger
 * /api/producteurs/{id}:
 *   delete:
 *     summary: Supprimer un producteur par ID
 *     tags:
 *       - Partenaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du producteur
 *     responses:
 *       200:
 *         description: Producteur supprimé
 */
router.route('/producteurs/:id').delete(protectWithToken, deleteProducteurById);

/**
 * @swagger
 * /api/producteurs/update:
 *   put:
 *     summary: Mettre à jour un producteur par propriété
 *     tags:
 *       - Partenaires
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
 *         description: Producteur mis à jour
 */
router.route('/producteurs/update').put(protectWithToken, updateProducteurByProperty);

module.exports = router;