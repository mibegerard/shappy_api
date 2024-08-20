const cloudinary = require("./cloudinary")
const ErrorResponse = require('./errorResponse')


exports.deleteAudioFile = async (req, res, next, publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true
    } catch (error) {
        next(new ErrorResponse('Erreur lors de la suppression du fichier audio', 500));
    }
}