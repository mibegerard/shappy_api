const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../helper/cloudinary');
const ErrorResponse = require('../helper/errorResponse');

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_START_FOLDER,
        format: async (req, file) => 'webp',
        public_id: (req, file) => file.originalname.split('.')[0],
        transformation: [
            {
                width: 400, // Set the desired width
                height: 400, // Set the desired height
                crop: 'fill' // Crop the image to fit the specified dimensions
            },
        ],
    },
});

// Add file filter to restrict to image types only
const fileFilter = (req, file, cb) => {
    // Allowed mime types for images
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new ErrorResponse('Invalid file type. Only images are allowed.', 400), false); // Reject the file
    }
};

// Apply file filter and storage configuration in multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Custom middleware to handle upload errors and dynamic field names
const uploadImageMiddleware = (fieldName) => (req, res, next) => {
    console.log(`Upload middleware triggered for field: ${fieldName}`);
    const multerUpload = upload.single(fieldName);
    
    multerUpload(req, res, (err) => {
        if (err) {
            console.error('File upload error:', err.message);
            return next(new ErrorResponse(`File upload error: ${err.message}`, 500));
        }
        
        console.log('File uploaded successfully:', req.file);
        next();
    });
};

module.exports = uploadImageMiddleware;
