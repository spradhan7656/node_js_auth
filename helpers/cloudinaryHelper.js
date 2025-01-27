/**
 * in this section use logic of cloudinary
 */
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath)=>{
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url : result.secure_url,
            publicId : result.public_id
        }
    } catch (error) {
        console.error('Error while uploading Cloudinary',error);
        throw new Error('Error while uploading Cloudinary');  
    }
}

module.exports = {
    uploadToCloudinary
}