
const express = require('express');
const adminPage = require('../controllers/admin-controller');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router=express.Router();

router.get('/welcome',authMiddleware,adminMiddleware,adminPage);

module.exports=router;