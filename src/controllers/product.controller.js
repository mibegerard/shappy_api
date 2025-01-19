const ProductModel = require("../models/product.model");
const ErrorResponse = require("../helper/errorResponse");
const asyncHandler = require("../helper/asyncHandler");

/*******************************************************************
 * @desc    Create a new product
 * @route   POST /product/create
 * @access  Private (Producteurs only)
 *******************************************************************/
exports.createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, quantity, category, unit } = req.body;

    if (!req.file) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    // Check if the user is authenticated and has the 'producteur' role
    if (!req.user || req.user.role !== 'producteur') {
        return next(new ErrorResponse('Unauthorized access', 403));
    }

    // Debugging: Log the authenticated user object
    console.log('Authenticated User11:', req.user);
    console.log('Producteur ID to be set:', req.user.id);
    const product = new ProductModel({
        name,
        description,
        price,
        category,
        quantity,
        unit,
        image: req.file.path,  // Store the image path
        producteur: req.user.id,
    });
    console.log('Product to be saved:', product);
    await product.save();

    res.status(201).json({
        success: true,
        data: product
    });
});

/*******************************************************************
 * @desc    Get all products with optional filtering and pagination
 * @route   GET /products
 * @access  Public
 *******************************************************************/
exports.getAllProducts = asyncHandler(async (req, res, next) => {
    // Extract query parameters for filtering and pagination
    const { name, category, minPrice, maxPrice, sortBy, page = 1, limit = 10 } = req.query;

    // Build query object
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' };  // Case-insensitive search
    }

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
    }

    // Sort by the specified field
    const sortOptions = sortBy ? { [sortBy]: 1 } : { createdAt: -1 };  // Default sort by creation date descending

    // Pagination options
    const products = await ProductModel.find(query)
        .populate('producteur', 'firstName lastName city postalCode telephone')
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalCount = await ProductModel.countDocuments(query);

    res.status(200).json({
        success: true,
        count: products.length,
        total: totalCount,
        page: Number(page),
        totalPages: Math.ceil(totalCount / limit),
        data: products
    });
});

/*******************************************************************
 * @desc    Get a product by ID
 * @route   GET /product/:id
 * @access  Public
 *******************************************************************/
exports.getProductById = asyncHandler(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.id)
        .populate('producteur', 'firstName lastName city postalCode telephone');

    if (!product) {
        return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

/*******************************************************************
 * @desc    Get a product by name
 * @route   GET /product/name/:name
 * @access  Public
 *******************************************************************/
exports.getProductByName = asyncHandler(async (req, res, next) => {
    const product = await ProductModel.findOne({ name: req.params.name })
        .populate('producteur', 'firstName lastName city postalCode telephone');

    if (!product) {
        return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

/*******************************************************************
 * @desc    Update a product by ID
 * @route   PUT /product/:id
 * @access  Private (Producteurs only)
 *******************************************************************/
exports.updateProductById = asyncHandler(async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id);

    if (!product || product.producteur.toString() !== req.user.id.toString()) {
        return next(new ErrorResponse('Product not found or unauthorized', 404));
    }

    const updates = { ...req.body };

    if (req.file) {
        updates.image = req.file.path;  // Update the image if a new one is uploaded
    }

    product = await ProductModel.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    }).populate('producteur', 'firstName lastName city postalCode telephone'); // Ensure populated fields

    res.status(200).json({
        success: true,
        data: product
    });
});

/*******************************************************************
 * @desc    Delete a product by ID
 * @route   DELETE /product/:id
 * @access  Private (Producteurs only)
 *******************************************************************/
exports.deleteProductById = asyncHandler(async (req, res, next) => {
    console.log(`Attempting to delete product with ID: ${req.params.id}`);

    const product = await ProductModel.findById(req.params.id);

    if (!product) {
        console.error(`Product with ID: ${req.params.id} not found`);
        return next(new ErrorResponse('Product not found', 404));
    }

    if (product.producteur.toString() !== req.user.id.toString()) {
        console.error(`Unauthorized attempt to delete product with ID: ${req.params.id} by user ID: ${req.user.id}`);
        return next(new ErrorResponse('Unauthorized', 403));
    }

    await ProductModel.deleteOne({ _id: req.params.id });
    console.log(`Product with ID: ${req.params.id} successfully deleted`);

    res.status(200).json({
        success: true,
        data: {}
    });
});

/*******************************************************************
 * @desc                Update current product by a property
 * @Method              PUT
 * @URL                 /api/products/update/:id
 * @access              Private
 *******************************************************************/
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const { property, updateData } = req.body;

    // Log incoming data for debugging
    console.log('Incoming Request:', req.body);

    if (!productId) {
        return next(new ErrorResponse('Product ID is required', 400));
    }

    if (!property || !updateData) {
        return next(new ErrorResponse('Property and update data are required', 400));
    }

    // Log the property and updateData being used for the update
    console.log(`Updating product's ${property} with data:`, updateData);

    // Construct the update query dynamically
    const updateQuery = { _id: productId };

    // Prepare dynamic update payload
    const updatePayload = { [property]: updateData };

    // Log the update query and payload before executing the update
    console.log('Update Query:', updateQuery);
    console.log('Update Payload:', updatePayload);

    // Perform the update with the correct payload structure
    const product = await ProductModel.findOneAndUpdate(updateQuery, updatePayload, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        return next(
            new ErrorResponse(`No product found with ID = ${productId}`, 404)
        );
    }

    // Log the updated product data
    console.log('Updated Product:', product);

    // Send the response with the updated data
    res.status(200).json({
        success: true,
        data: product,
    });
});
