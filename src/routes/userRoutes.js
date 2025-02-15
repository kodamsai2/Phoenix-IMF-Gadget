const router = require("express").Router();
const { createUser, signin } = require("../controllers/userController");

router.post("/signup", createUser);
router.post("/signin", signin);

module.exports = router;