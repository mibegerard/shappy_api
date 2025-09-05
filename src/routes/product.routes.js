const express = require("express");
const router = express.Router();

// Import middleware
const { protectWithToken, ensureProducteurRole, verifyUser } = require("../middlewares/auth.middleware");
const uploadImageMiddleware = require('../middlewares/uploadImage.middleware');

// Import controller functions
const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProductById,
    deleteProductById,
    updateProduct
} = require('../controllers/product.controller');

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags:
 *       - Produits
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *               unit:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         description: Erreur de validation
 */
router.post('/product/create', 
    protectWithToken,                     
    ensureProducteurRole,
    verifyUser,    
    uploadImageMiddleware("image"), 
    createProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits (avec filtres et pagination optionnels)
 *     tags:
 *       - Produits
 *     responses:
 *       200:
 *         description: Liste des produits récupérée
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit récupéré
 *       404:
 *         description: Produit non trouvé
 */
router.get('/product/:id', getProductById);

/**
 * @swagger
 * /api/product/name/{name}:
 *   get:
 *     summary: Récupérer un produit par nom
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du produit
 *     responses:
 *       200:
 *         description: Produit récupéré
 *       404:
 *         description: Produit non trouvé
 */
router.get('/product/name/:name', getProductByName);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Mettre à jour un produit par ID
 *     tags:
 *       - Produits
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
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               category:
 *                 type: string
 *               unit:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit non trouvé
 */
router.put('/product/:id', 
    protectWithToken,                 
    ensureProducteurRole,
    verifyUser,
    uploadImageMiddleware("image"), 
    updateProductById
);

/**
 * @swagger
 * /api/product/update/{id}:
 *   put:
 *     summary: Mettre à jour une propriété spécifique d'un produit
 *     tags:
 *       - Produits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Propriété du produit mise à jour
 *       404:
 *         description: Produit non trouvé
 */
router.put('/product/update/:id', 
    protectWithToken,                 
    ensureProducteurRole,
    verifyUser,
    updateProduct
);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Supprimer un produit par ID
 *     tags:
 *       - Produits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/product/:id', 
    protectWithToken,         
    ensureProducteurRole,
    verifyUser,    
    deleteProductById
);

module.exports = router;