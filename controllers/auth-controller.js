const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/**
 * this bcrypt will help for password store in the hashing or salting
 */

//register controller 
const registerUser= async (req,res)=>{
    try {
        //extract user information from the request body
        const {username,email,password,role} = req.body;
        //check if the user is already exists in our database and the $or method will check username and email
        const checkExistingUser= await User.findOne({$or:[{username},{email}]})

        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : 'User is already exists with same email or same username. Please try with a different username and email'
            })
        }

        //hash user password
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        //create a new user and save in the database
        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || 'user',
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : 'User register successfully'
            })
        }else{
            res.status(400).json({
                success : false,
                message : 'Unable to register User ! Please try again '
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error occoured ! please try again ',
        });
    }
}

//login controller
const loginUser= async (req,res)=>{
    try {
        const {username,password} = req.body;
        //checking the user name is exist or not
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success : false,
                message : 'User doesnot exist !'
            })
        }
        //checking the password is correct or not
        const isPasswordMatch = await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : 'Invalid username and password'
            })
        }
        // create a user token JWT in the sign pass the user information not stored password
        const accessToken =jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : '15m'
        });

        res.status(200).json({
            success : true,
            message : 'Logged in successful',
            accessToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error occoured ! please try again ',
        });
    }
}

const changePassword = async (req,res)=>{
    try {
        const userId=req.userInfo.userId
        //extract old and new password
        const {oldPassword,newPassword}=req.body;

        //find the current user loggedin
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success : false,
                message : 'User not found'
            })
        }

        //checking the old password is correct or not
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : 'Old password is not correct ! please try again'
            })
        }
        //hash the new password

        const salt = await bcrypt.genSalt(10);
        const newhashedPassword= await bcrypt.hash(newPassword,salt);

        user.password = newhashedPassword;
        await user.save();
        res.status(200).json({
            success : true,
            message : 'Password change successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error occoured ! please try again ',
        });
    }
}

module.exports = {registerUser,loginUser,changePassword};