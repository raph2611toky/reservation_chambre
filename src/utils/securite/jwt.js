require("dotenv").config()
const jwt = require('jsonwebtoken');

const generateToken = (payload) => { 
    token= jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    return token;
}
const verifyToken = (token) => {
    res= jwt.verify(token, process.env.JWT_SECRET);
    return res;
}

module.exports = { generateToken, verifyToken };