const CartModel = require("../models/cart.model");
const ProductModel = require("../models/product.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const RestaurateurUserModel = require("../models/restaurateur.model");
const ErrorResponse = require("../helper/errorResponse");
const asyncHandler = require("../helper/asyncHandler");

// Create a new cart for a restaurateur
exports.createCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(`Creating cart for restaurateur: ${user_id}`);

        const restaurateur = await RestaurateurUserModel.findById(user_id);
        if (!restaurateur) {
            console.error(`Restaurateur not found: ${user_id}`);
            return res.status(404).json({ message: "Restaurateur not found" });
        }

        const cart = new CartModel({ restaurateur: user_id, products: [], totalPrice: 0 });
        await cart.save();

        console.log(`Cart created successfully for restaurateur: ${user_id}`);
        res.status(201).json(cart);
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ message: "Error creating cart", error });
    }
};

// Retrieve a cart for a restaurateur
exports.getCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(`Fetching cart for restaurateur: ${user_id}`);

        // Fetch the cart and populate product details, including the producteur name
        const cart = await CartModel.findOne({ restaurateur: user_id })
            .populate({
                path: 'products.product',
                select: 'name price unit image quantity producteur', // Select only necessary fields from Product
                populate: {
                    path: 'producteur', // Populate the producteur information
                    select: 'firstName lastName' // Select producteur name (adjust as needed)
                }
            });

        if (!cart) {
            console.error(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({ message: "Error retrieving cart", error });
    }
};

exports.getProductDetailsInCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        console.log(`Fetching details for product ${product_id} in cart of restaurateur: ${user_id}`);

        // Log the parameters to ensure they are correctly passed
        console.log("Parameters received: ", { user_id, product_id });

        // Fetch the cart and populate the product details
        const cart = await CartModel.findOne({ restaurateur: user_id })
            .populate({
                path: 'products.product',
                select: 'name price unit image producteur',
                populate: {
                    path: 'producteur',
                    select: 'firstName lastName'
                }
            });

        // Log the cart data for debugging
        console.log("Fetched cart: ", cart);

        if (!cart) {
            console.error(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        console.log("Cart found, checking for product...");

        // Log the cart products
        console.log("Cart products: ", cart.products);

        // Find the product in the cart
        const product = cart.products.find(item => item.product._id.toString() === product_id);

        if (!product) {
            console.error(`Product ${product_id} not found in cart for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Log the found product
        console.log("Product found in cart: ", product);

        // Return the product details along with its quantity, total price, and producteur information
        const productDetails = {
            product: product.product,
            quantity: product.quantity,
            totalPrice: product.totalPrice,
            producteur: product.product.producteur
        };

        console.log(`Fetched details for product ${product_id} successfully`);

        // Log the final product details to be returned
        console.log("Returning product details: ", productDetails);

        res.status(200).json(productDetails);
    } catch (error) {
        console.error("Error fetching product details in cart:", error);
        res.status(500).json({ message: "Error fetching product details in cart", error });
    }
};


// Add a product to the cart
exports.addProductToCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { productId, quantity } = req.body;

        // Basic validation
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid productId or quantity" });
        }

        console.log(`Adding product ${productId} (quantity: ${quantity}) to cart for restaurateur: ${user_id}`);

        // Fetch the restaurateur to verify the user exists
        const restaurateur = await RestaurateurUserModel.findById(user_id);
        if (!restaurateur) {
            console.error(`Restaurateur not found: ${user_id}`);
            return res.status(404).json({ message: "Restaurateur not found" });
        }

        // Fetch the product details
        const product = await ProductModel.findById(productId);
        if (!product) {
            console.error(`Product not found: ${productId}`);
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the cart exists, if not create a new one
        let cart = await CartModel.findOne({ restaurateur: user_id });
        if (!cart) {
            cart = new CartModel({ restaurateur: user_id, products: [], totalPrice: 0 });
        }

        // Find if the product is already in the cart
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
        
        if (existingProductIndex > -1) {
            // If the product exists in the cart, update its quantity and totalPrice
            cart.products[existingProductIndex].quantity += quantity;
            cart.products[existingProductIndex].totalPrice = cart.products[existingProductIndex].quantity * product.price;
            console.log(`Updated quantity of product ${productId} in cart for restaurateur: ${user_id}`);
        } else {
            // If the product does not exist in the cart, add it
            cart.products.push({
                product: productId,
                quantity,
                price: product.price,
                totalPrice: product.price * quantity
            });
            console.log(`Added new product ${productId} to cart for restaurateur: ${user_id}`);
        }

        // Recalculate total price of the cart
        cart.totalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0);

        // Save the updated cart
        await cart.save();
        console.log(`Cart updated successfully for restaurateur: ${user_id}`);

        // Return the updated cart
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ message: "Error adding product to cart", error });
    }
};


// Update product quantity in the cart
exports.updateProductQuantity = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { productId, quantity } = req.body;

        console.log(`Received request to update quantity of product ${productId} to ${quantity} for restaurateur: ${user_id}`);

        if (quantity < 1) {
            console.error("Quantity must be at least 1");
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        // Find the cart associated with the restaurateur
        const cart = await CartModel.findOne({ restaurateur: user_id });

        if (!cart) {
            console.error(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        console.log(`Cart found for restaurateur: ${user_id}. Products: ${JSON.stringify(cart.products, null, 2)}`);

        // Find the index of the product in the cart
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId.toString());

        if (productIndex === -1) {
            console.error(`Product ${productId} not found in cart for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Update the quantity and total price for the product
        cart.products[productIndex].quantity = quantity;
        cart.products[productIndex].totalPrice = cart.products[productIndex].price * quantity;

        // Recalculate the total price of the cart
        cart.totalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0);

        // Save the updated cart
        await cart.save();

        console.log(`Quantity updated for product ${productId} in cart for restaurateur: ${user_id}`);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error updating product quantity:", error);
        res.status(500).json({ message: "Error updating product quantity", error });
    }
};


// Remove a product from the cart
exports.removeProductFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        console.log(`Removing product ${product_id} from cart for restaurateur: ${user_id}`);

        const cart = await CartModel.findOne({ restaurateur: user_id });
        if (!cart) {
            console.error(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === product_id);
        if (productIndex === -1) {
            console.error(`Product ${product_id} not found in cart for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the product and recalculate total price
        cart.products.splice(productIndex, 1);
        cart.totalPrice = cart.products.reduce((total, item) => total + item.totalPrice, 0);

        await cart.save();
        console.log(`Product ${product_id} removed successfully from cart for restaurateur: ${user_id}`);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "Error removing product from cart", error });
    }
};

// Clear the cart
exports.clearCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        console.log(`Attempting to clear cart for restaurateur: ${user_id}`);

        const cart = await CartModel.findOne({ restaurateur: user_id });
        if (!cart) {
            console.warn(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        if (cart.products.length === 0) {
            console.log(`Cart is already empty for restaurateur: ${user_id}`);
            return res.status(200).json({ message: "Cart is already empty", cart });
        }

        cart.products = [];
        cart.totalPrice = 0;

        await cart.save();

        console.log(`Cart cleared successfully for restaurateur: ${user_id}`);
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.error(`Error clearing cart for restaurateur: ${user_id}`, error);
        res.status(500).json({ message: "Error clearing cart", error });
    }
};

// Retrieve total price of the cart
exports.getTotalPrice = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(`Fetching total price for cart of restaurateur: ${user_id}`);

        const cart = await CartModel.findOne({ restaurateur: user_id });
        if (!cart) {
            console.error(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ totalPrice: cart.totalPrice });
    } catch (error) {
        console.error("Error retrieving total price:", error);
        res.status(500).json({ message: "Error retrieving total price", error });
    }
};

// Checkout the cart
exports.checkoutCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(`Processing checkout for restaurateur: ${user_id}`);

        const cart = await CartModel.findOne({ restaurateur: user_id });
        if (!cart) {
            console.error(`Cart not found for restaurateur: ${user_id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        // Proceed with the checkout process (implement payment integration here if needed)
        // For simplicity, we are just clearing the cart after checkout
        cart.products = [];
        cart.totalPrice = 0;

        await cart.save();
        console.log(`Checkout completed successfully for restaurateur: ${user_id}`);
        res.status(200).json({ message: "Checkout completed successfully", cart });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error });
    }
};

/*******************************************************************
 * @desc                Get Stripe Checkout session status
 * @route               GET /cart/stripe/session-status
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
exports.getStripeSessionStatus = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).send({ error: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        console.log("Stripe session details:", session);
        res.status(200).send({
            status: session.status,
            customer_email: session.customer_details.email,
            session_id: session.id,
            payment_status: session.payment_status,
            amount_total: session.amount_total,
            currency: session.currency,
            created: session.created,
            expires_at: session.expires_at,
            payment_intent: session.payment_intent,
            url: session.url,
        });
    } catch (error) {
        if (error.type === "StripeInvalidRequestError") {
            return res.status(400).send({ error: "Invalid session ID" });
        }
        console.error("Error retrieving Stripe session status:", error);
        res.status(500).send({ error: "Failed to retrieve session status" });
    }    
};

/*******************************************************************
 * @desc                Create a Stripe Checkout session
 * @route               POST /cart/stripe/checkout-session
 * @access              Private (Restaurateurs only, Verified users)
 *******************************************************************/
exports.createStripeCheckoutSession = async (req, res, next) => {
    try {
        const origin = req.headers.origin || process.env.ORIGIN || 'https://localhost:3000';

        // Force HTTPS if the origin is in HTTP
        const secureOrigin = origin.startsWith('http://') ? origin.replace('http://', 'https://') : origin;

        console.log('Request origin:', origin);
        console.log('Secure origin:', secureOrigin);

        const allowedOrigins = [process.env.ORIGIN, 'https://localhost:3000'];
        if (!allowedOrigins.includes(secureOrigin)) {
            return next(new ErrorResponse('Origin not allowed', 403));
        }

        const { items, email } = req.body;

        console.log("Received items:", items);
        console.log("Received email:", email);
        

        console.log("User email:", email);

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid items array" });
        }

        if (!email) {
            return res.status(400).json({ message: "User email is required" });
        }

        // Validate and map items
        const lineItems = await Promise.all(
            items.map(async (item, index) => {
                // Check if the product ID is present in the correct field
                const productId = item._id || item.product; // Support both `_id` and `product` fields
                if (!productId) {
                    throw new ErrorResponse(`Product ID is missing for item at index ${index}`, 400);
                }

                // Log the full object of item for debugging
                console.log("Item object:", item);
                console.log("Product Object:", productId);

                // Retrieve the product from the database
                const product = await ProductModel.findById(productId);
                if (!product || !product.priceId) {
                    throw new ErrorResponse(`Product with ID ${productId} not found or missing priceId`, 400);
                }

                return {
                    price: product.priceId, // Use the Stripe price ID
                    quantity: item.quantity || 1,
                };
            })
        );

        // Add a fixed delivery fee of 5 EUR
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: 'Livraison',
                },
                unit_amount: 500, // 5 EUR in cents
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            ui_mode: 'embedded',
            mode: 'payment',
            customer_email: email,
            return_url: `${secureOrigin}/return?session_id={CHECKOUT_SESSION_ID}`,
        });

        res.status(200).send({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        res.status(500).send({ error: error.message || "Failed to create checkout session" });
    }
};