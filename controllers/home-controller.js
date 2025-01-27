
const homePage = async (req,res)=>{

    const {userId,username,role}=req.userInfo;
    res.json({
        message : 'Welcome to Home page',
        user : {
            _id : userId,
            username,
            role,
        }
    })
}

module.exports = homePage;