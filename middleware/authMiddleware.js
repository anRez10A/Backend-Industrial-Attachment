const jwt = require("jsonwebtoken");
const TOKEN_KEY = 'ABCXYZ';

const verifyToken = (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const token = bearerToken.substring(7);
        const decoded = jwt.verify(token, TOKEN_KEY);
        req.user = decoded;
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
    
};

module.exports = verifyToken;