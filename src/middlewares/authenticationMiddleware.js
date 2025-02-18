const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
    try {
        const jwtToken = req.header('X-Authorization')
        if (!jwtToken) {
            return res.status(401).send({ message: "Unauthorized access, Please provide jwtToken in header", success: false });
        }

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
       
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).send({ message: "Internal server error during authenticating user, User not found", success: false});
        } 
        
        req.userId = user._id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error during authenticating user", success: false, error: error.message });
    }
}

module.exports = authenticateUser
