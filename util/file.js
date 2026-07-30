const {v2: cloudinary} = require('cloudinary');

const deleteFile = async (imagePublicID) => {
    if (!imagePublicID) return;
    try {
        await cloudinary.uploader.destroy(imagePublicID);
    } catch (err) {
        console.error('Cloudinary delete failed:', err.message);
    }
}

exports.deleteFile = deleteFile;