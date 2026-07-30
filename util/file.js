const {v2: cloudinary} = require('cloudinary');

const deleteFile = async (imagePublicID) => {
    await cloudinary.uploader.destroy(imagePublicID);
}

exports.deleteFile = deleteFile;