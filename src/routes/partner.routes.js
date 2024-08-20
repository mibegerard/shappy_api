const express = require("express");
const {
    getAllRestaurateurs,
    getRestaurateurByProperty,
    deleteRestaurateurById,
    updateRestaurateurByProperty,
    getAllProducteurs,
    getProducteurByProperty,
    deleteProducteurById,
    updateProducteurByProperty
} = require("../controllers/partners.controller");
const { protectWithToken } = require("../middlewares/auth.middleware");

const router = express.Router();

/*******************************************************************
 * @desc                Get all restaurateurs
 * @route               GET /api/restaurateurs
 * @access              Public
 *******************************************************************/
router.route('/restaurateurs').get(getAllRestaurateurs);

/*******************************************************************
 * @desc                Get restaurateur by a property
 * @route               GET /api/restaurateurs/find
 * @access              Public
 *******************************************************************/
router.route('/restaurateurs/find').get(getRestaurateurByProperty);

/*******************************************************************
 * @desc                Delete restaurateur by ID
 * @route               DELETE /api/restaurateurs/:id
 * @access              Private
 *******************************************************************/
router.route('/restaurateurs/:id').delete(protectWithToken, deleteRestaurateurById);

/*******************************************************************
 * @desc                Update restaurateur by a property
 * @route               PUT /api/restaurateurs/update
 * @access              Private
 *******************************************************************/
router.route('/restaurateurs/update').put(protectWithToken, updateRestaurateurByProperty);

/*******************************************************************
 * @desc                Get all producteurs
 * @route               GET /api/producteurs
 * @access              Public
 *******************************************************************/
router.route('/producteurs').get(getAllProducteurs);

/*******************************************************************
 * @desc                Get producteur by a property
 * @route               GET /api/producteurs/find
 * @access              Public
 *******************************************************************/
router.route('/producteurs/find').get(getProducteurByProperty);

/*******************************************************************
 * @desc                Delete producteur by ID
 * @route               DELETE /api/producteurs/:id
 * @access              Private
 *******************************************************************/
router.route('/producteurs/:id').delete(protectWithToken, deleteProducteurById);

/*******************************************************************
 * @desc                Update producteur by a property
 * @route               PUT /api/producteurs/update
 * @access              Private
 *******************************************************************/
router.route('/producteurs/update').put(protectWithToken, updateProducteurByProperty);

module.exports = router;
