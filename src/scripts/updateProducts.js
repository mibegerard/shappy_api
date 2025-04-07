const { updateProductsWithPriceId } = require('../controllers/product.controller');
const mongoose = require('mongoose');

(async () => {
    try {
        console.log('Starting product update...');
        await updateProductsWithPriceId();
        console.log('Product update completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during product update:', error);
        process.exit(1);
    }
})();