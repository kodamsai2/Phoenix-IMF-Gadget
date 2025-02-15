const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createUser = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        res.status(400).send({ message: 'name and password are required', success: false });
    }

    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const user = await User.create({ name, password: hashedPassword });
        if (!user) {
            res.status(500).send({ message: 'User not created', success: false});
        }
        
        // Generate JWT token
        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).send({ message: "User created successfully", success: true, data: {userId: user.id, name: user.name, jwtToken} });
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send({ message: `User with name '${name}' already exists.`, success: false });
        }
        res.status(500).send({ message: "Internal server error during create user", success: false, error: error.message });
    }
}

const signin = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        res.status(400).send({ message: 'name and password are required', success: false });
    }

    try {
        const user = await User.findOne({ where: { name } });
        if (!user) {
            res.status(404).send({ message: 'User not found', success: false });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send({ message: 'Invalid credentials', success: false });
        }
       
        // Generate JWT token
        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).send({ message: 'Successfully logged in', success: true, data: jwtToken });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error during user signin", success: false, error: error.message });
    }
}

module.exports = {
    createUser,
    signin
}