const express = require('express');
const homePage = require('../controllers/home-controller')
const authMiddleware = require('../middleware/auth-middleware');
const router=express.Router();

/**
 * router.get('/welcome',handler1,handler2,homePage)
 * if handler are false the next code is failed if the handler is successfuly then call homePage
 */

router.get('/welcome',authMiddleware,homePage);

module.exports=router;