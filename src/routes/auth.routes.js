const express = require("express");
const {
    registerAsRestaurateur,
    registerAsProducteur,
    login,
    logout
} = require("../controllers/auth.controller");
const {
    validatePassword,
    protectWithToken,
    verifyAndGetUser
} = require("../middlewares/auth.middleware");

const router = express.Router();

/*******************************************************************
 * @desc                Register a new Restaurateur user
 * @route               POST /auth/register/restaurateur
 * @access              Public
 *******************************************************************/
router.route('/auth/register/restaurateur').post(registerAsRestaurateur);

/*******************************************************************
 * @desc                Register a new Producteur user
 * @route               POST /auth/register/restaurateur
 * @access              Public
 *******************************************************************/
router.route('/auth/register/producteur').post(registerAsProducteur);

/*******************************************************************
 * @desc                Login a user (both restaurateur and producteur)
 * @route               POST /auth/login
 * @access              Public
 *******************************************************************/
router.route('/auth/login', validatePassword, login);

/*******************************************************************
 * @desc                Logout a user
 * @route               POST /auth/log-out
 * @access              Public
 *******************************************************************/
router.route('/auth/log-out').post(logout);

/*******************************************************************
 * @desc                Get current logged-in user's data
 * @route               GET /auth/me
 * @access              Private
 *******************************************************************/
router.route('/auth/me').get(protectWithToken, verifyAndGetUser);


module.exports = router;
