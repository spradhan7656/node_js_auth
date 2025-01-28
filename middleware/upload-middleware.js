//in the upload can handel this middle ware

const multer = require('multer');
const path = require('path');

//set our multer storage 
// in the multer i am using diskstorage
const storage=multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"uploads/")
    },
    filename : function(req,file,cb){
        cb(null,
            file.fieldname+"-"+Date.now()+path.extname(file.originalname)
        )
    }
});

// file.fieldname+"-"+Date.now()+path.extname(file.originalname) generated the uique file name

//file filter function 

const checkFileFilter= (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new Error('Not an images ! please upload only images'));
    }
}

//create a multer middleware 
/**
 * need disk storage 
 * need filter
 * need limits
 */
module.exports=multer({
    storage : storage,
    fileFilter : checkFileFilter,
    limits : {
        fieldSize : 5*1024*1024
    }
})