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

/*******************************************************************
 * @desc                Create a product
 * @route               POST /product/create
 * @access              Private (Producteurs only, Verified users)
 *******************************************************************/
router.post('/product/create', 
    protectWithToken,                     
    ensureProducteurRole,
    verifyUser,    
    uploadImageMiddleware("image"), 
    createProduct
);
/*******************************************************************
 * @desc                Get all products with optional filtering and pagination
 * @route               GET /products
 * @access              Public
 *******************************************************************/
router.get('/products', getAllProducts);

/*******************************************************************
 * @desc                Get a product by ID
 * @route               GET /product/:id
 * @access              Public
 *******************************************************************/
router.get('/product/:id', getProductById);

/*******************************************************************
 * @desc                Get a product by name
 * @route               GET /product/name/:name
 * @access              Public
 *******************************************************************/
router.get('/product/name/:name', getProductByName);

/*******************************************************************
 * @desc                Update a product by ID
 * @route               PUT /product/:id
 * @access              Private (Producteurs only, Verified users)
 *******************************************************************/
router.put('/product/:id', 
    protectWithToken,                 
    ensureProducteurRole,
    verifyUser,
    uploadImageMiddleware("image"), 
    updateProductById
);

/*******************************************************************
 * @desc                Update a specific property of the current product
 * @route               PUT /product/update/:id
 * @access              Private (Producteurs only, Verified users)
 *******************************************************************/
router.put('/product/update/:id', 
    protectWithToken,                 
    ensureProducteurRole,
    verifyUser,
    updateProduct
);

/*******************************************************************
 * @desc                Delete a product by ID
 * @route               DELETE /product/:id
 * @access              Private (Producteurs only, Verified users)
 *******************************************************************/
router.delete('/product/:id', 
    protectWithToken,         
    ensureProducteurRole,
    verifyUser,    
    deleteProductById
);

module.exports = router;
