const userRoutes = require("express").Router();
const { body } = require("express-validator");
const { createUser, signIn } = require("../controllers/userController");

userRoutes.post("/signup",
    body('name').notEmpty().isString().trim().isLength({ min: 3, max: 50 }),
    body('password').notEmpty().isString().trim().isLength({ min: 3, max: 50 }), 
    createUser
);

userRoutes.post("/signin", 
    body('name').notEmpty().isString().trim().isLength({ min: 3, max: 50 }),
    body('password').notEmpty().isString().trim().isLength({ min: 3, max: 50 }), 
    signIn
);

module.exports = userRoutes;