const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../helper/cloudinary');
const ErrorResponse = require('../helper/errorResponse');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_START_FOLDER,
        format: async (req, file) => 'webp',
        public_id: (req, file) => file.originalname.split('.')[0],
    },
});

const upload = multer({ storage: storage });

// Custom middleware to handle upload errors and dynamic field names
const uploadImageMiddleware = (fieldName) => (req, res, next) => {
    const multerUpload = upload.single(fieldName);
    multerUpload(req, res, (err) => {
        if (err) {
            return next(new ErrorResponse(`File upload error : ${err.message}`, 500));
        }
        next();
    });
};

module.exports = uploadImageMiddleware;