const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../helper/cloudinary');
const ErrorResponse = require('../helper/errorResponse');
const sharp = require('sharp');
const path = require('path');

// Define desired image size
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 800;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_START_FOLDER,
        format: async (req, file) => 'webp', // Convert to webp format
        public_id: (req, file) => file.originalname.split('.')[0], // Save with the original file name
    },
});

const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage to manipulate the image buffer
});

// Custom middleware to handle upload errors, dynamic field names, and resizing
const uploadImageMiddleware = (fieldName) => async (req, res, next) => {
    const multerUpload = upload.single(fieldName);
    multerUpload(req, res, async (err) => {
        if (err) {
            return next(new ErrorResponse(`File upload error: ${err.message}`, 500));
        }
        
        // Resize the image using sharp before uploading
        if (req.file) {
            try {
                const resizedBuffer = await sharp(req.file.buffer)
                    .resize(IMAGE_WIDTH, IMAGE_HEIGHT) // Resize to 800x800
                    .toFormat('webp') // Convert to webp format
                    .toBuffer();
                
                // Replace original file buffer with resized one
                req.file.buffer = resizedBuffer;
                
                // Update file information for Cloudinary upload
                req.file.originalname = path.parse(req.file.originalname).name + '.webp';

                // Now call Cloudinary upload
                const multerUpload = upload.single(fieldName);
                multerUpload(req, res, next);
            } catch (error) {
                return next(new ErrorResponse(`Image resizing error: ${error.message}`, 500));
            }
        } else {
            next();
        }
    });
};

module.exports = uploadImageMiddleware;
