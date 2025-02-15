const router = require("express").Router();
const authenticateUser = require("../middlewares/authenticationMiddleware.js");
const { getAllGadgetsBasedOnStatus, createGadget, updateGadgetInfo, deleteGadget, selfDestructGadget } = require("../controllers/gadgetController");

router.get("/", authenticateUser, getAllGadgetsBasedOnStatus);
router.post("/", authenticateUser, createGadget);
router.patch("/:id", authenticateUser, updateGadgetInfo);
router.delete("/:id", authenticateUser, deleteGadget);

router.post('/:id/self-destruct', authenticateUser,selfDestructGadget);

module.exports = router;