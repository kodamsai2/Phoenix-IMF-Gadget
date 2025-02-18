const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

const createUser = async (req, res) => {
    // Validate the request
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({ message: "Require all fields", success: false, error: result.array() });
    }

    const { name, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const user = await User.create({ name, password: hashedPassword });
        if (!user) {
            return res.status(500).send({ message: 'User not created', success: false});
        }
        
        // Generate JWT token
        const jwtToken = jwt.sign({ id: user._id, uuid: user.userUUID }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(201).send({ message: "User created successfully", success: true, data: {userUUID: user.userUUID, name: user.name, jwtToken} });
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: `User with name '${name}' already exists.`, success: false });
        }
        return res.status(500).send({ message: "Internal server error during create user", success: false, error: error.message });
    }
}

const signIn = async (req, res) => {
    // Validate the request
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({ message: "Require all fields", success: false, error: result.array() });
    }

    const { name, password } = req.body;
    try {
        const user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials', success: false });
        }
        
        // Generate JWT token
        const jwtToken = jwt.sign({ id: user._id, uuid: user.userUUID }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).send({ message: 'Successfully logged in', success: true, data: { jwtToken } });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error during user signin", success: false, error: error.message });
    }
}

module.exports = {
    createUser,
    signIn
}