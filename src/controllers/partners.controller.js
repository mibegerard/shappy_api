const asyncHandler = require("../helper/asyncHandler");
const ErrorResponse = require("../helper/errorResponse");
const RestaurateurUserModel = require("../models/restaurateur.model");
const ProducteurUserModel = require("../models/producteur.model");
const { omit } = require("lodash");

/*******************************************************************
 * @desc                Get all restaurateurs
 * @Method              GET
 * @URL                 /api/restaurateurs
 * @access              Public
 *******************************************************************/
exports.getAllRestaurateurs = asyncHandler(async (req, res, next) => {
    const restaurateurs = await RestaurateurUserModel.find();
    res.status(200).json({
        success: true,
        count: restaurateurs.length,
        data: restaurateurs.map(r => omit(r.toObject(), ['password']))
    });
});

/*******************************************************************
 * @desc                Get restaurateur by a property
 * @Method              GET
 * @URL                 /api/restaurateurs/find
 * @access              Public
 *******************************************************************/
exports.getRestaurateurByProperty = asyncHandler(async (req, res, next) => {
    const { property, value } = req.query;

    const query = {};
    query[property] = value;

    const restaurateur = await RestaurateurUserModel.findOne(query);

    if (!restaurateur) {
        return next(new ErrorResponse(`No restaurateur found with ${property} = ${value}`, 404));
    }

    res.status(200).json({
        success: true,
        data: omit(restaurateur.toObject(), ['password'])
    });
});

/*******************************************************************
 * @desc                Delete restaurateur by ID
 * @Method              DELETE
 * @URL                 /api/restaurateurs/:id
 * @access              Private
 *******************************************************************/
exports.deleteRestaurateurById = asyncHandler(async (req, res, next) => {
    const restaurateur = await RestaurateurUserModel.findByIdAndDelete(req.params.id);

    if (!restaurateur) {
        return next(new ErrorResponse(`No restaurateur found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Restaurateur deleted successfully'
    });
});

/*******************************************************************
 * @desc                Update restaurateur by a property
 * @Method              PUT
 * @URL                 /api/restaurateurs/update
 * @access              Private
 *******************************************************************/
exports.updateRestaurateurByProperty = asyncHandler(async (req, res, next) => {
    const { property, value, updateData } = req.body;

    const query = {};
    query[property] = value;

    let restaurateur = await RestaurateurUserModel.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true
    });

    if (!restaurateur) {
        return next(new ErrorResponse(`No restaurateur found with ${property} = ${value}`, 404));
    }

    res.status(200).json({
        success: true,
        data: omit(restaurateur.toObject(), ['password'])
    });
});

/*******************************************************************
 * @desc                Get all producteurs
 * @Method              GET
 * @URL                 /api/producteurs
 * @access              Public
 *******************************************************************/
exports.getAllProducteurs = asyncHandler(async (req, res, next) => {
    const producteurs = await ProducteurUserModel.find();
    res.status(200).json({
        success: true,
        count: producteurs.length,
        data: producteurs.map(p => omit(p.toObject(), ['password']))
    });
});

/*******************************************************************
 * @desc                Get producteur by a property
 * @Method              GET
 * @URL                 /api/producteurs/find
 * @access              Public
 *******************************************************************/
exports.getProducteurByProperty = asyncHandler(async (req, res, next) => {
    const { property, value } = req.query;

    const query = {};
    query[property] = value;

    const producteur = await ProducteurUserModel.findOne(query);

    if (!producteur) {
        return next(new ErrorResponse(`No producteur found with ${property} = ${value}`, 404));
    }

    res.status(200).json({
        success: true,
        data: omit(producteur.toObject(), ['password'])
    });
});

/*******************************************************************
 * @desc                Delete producteur by ID
 * @Method              DELETE
 * @URL                 /api/producteurs/:id
 * @access              Private
 *******************************************************************/
exports.deleteProducteurById = asyncHandler(async (req, res, next) => {
    const producteur = await ProducteurUserModel.findByIdAndDelete(req.params.id);

    if (!producteur) {
        return next(new ErrorResponse(`No producteur found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Producteur deleted successfully'
    });
});

/*******************************************************************
 * @desc                Update producteur by a property
 * @Method              PUT
 * @URL                 /api/producteurs/update
 * @access              Private
 *******************************************************************/
exports.updateProducteurByProperty = asyncHandler(async (req, res, next) => {
    const { property, value, updateData } = req.body;

    const query = {};
    query[property] = value;

    let producteur = await ProducteurUserModel.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true
    });

    if (!producteur) {
        return next(new ErrorResponse(`No producteur found with ${property} = ${value}`, 404));
    }

    res.status(200).json({
        success: true,
        data: omit(producteur.toObject(), ['password'])
    });
});
