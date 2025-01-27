//model
const Image = require('../models/image');

const {uploadToCloudinary}= require('../helpers/cloudinaryHelper');
const cloudinary = require('cloudinary');
//import fs
const fs = require('fs');

const uploadImageController = async (req,res)=>{
    try {
        //checking the file is missing in req object
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : 'File is required.Please the upload an image'
            })
        }

       
        //upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path);
        //store the image mongodb database url and public id

        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId
        });

        await newlyUploadedImage.save();

        //delete the upload image folder 
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success : true,
            message : 'Image uploaded successfully',
            image : newlyUploadedImage
        });
         
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! please try again'
        })
    }
}
//fetching all the images
const fetchImagesController = async (req,res)=>{
    try {

        const page = parseInt(req.query.page)||1;

        const limit = parseInt(req.query.limit) || 2;

        const skip = (page-1)*limit;
        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1:-1

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy]= sortOrder

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPages,
                totalImages,
                data : images
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! please try again'
        })
    }
}
//delete image

const deleteImageController = async (req,res)=>{
    try {
        const getCurrentIdofImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdofImageToBeDeleted);

        if(!image){
            return res.status(404).json({
                success : false,
                message : 'Image not found'
            })
        }

        //checking if this image is uploaded by current who is trying is deleted this
        if(image.uploadedBy.toString()!==userId){
            return res.status(403).json({
                success : false,
                message : 'You are not authorized to delete this image !'
            })
        }

        //delete the cloudinary storage 
        await cloudinary.uploader.destroy(image.publicId);

        //delete the image in the mongodb

         await Image.findByIdAndDelete(getCurrentIdofImageToBeDeleted);

         res.status(200).json({
            success : true,
            message : 'The image deleted successfully'
         })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! please try again'
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
};