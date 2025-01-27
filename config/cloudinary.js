
// set the cloudinary config file api key , name, api secret 

/**
 * cloudinary will help the upload image and generated one url image 
 */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;