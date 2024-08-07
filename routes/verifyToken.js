const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    // console.log(authHeader);
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            // console.log(user);
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            // console.log(req.user.id)
            next();
        })
    } else {
        return res.status(401).json("You are not authenticated");
    }
};

const verifyTokenAuthorization =  ( req, res, next) =>{ 
    verifyToken( req, res, () => {
        // console.log("par:", req.params.id)
        // console.log("use:", req.user.id)
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const verifyTokenAndAdmin =  ( req, res, next) =>{ 
    verifyToken( req, res, () => {
        console.log(req.user.isAdmin)
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

module.exports = { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin};