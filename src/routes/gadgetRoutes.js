const gadgetRoutes = require("express").Router();
const { param, query, body } = require("express-validator");
const { gadgetStatus } = require("../constants.js");
const authenticateUser = require("../middlewares/authenticationMiddleware.js");
const { 
    getAllGadgetsBasedOnStatus, 
    createGadget, 
    updateGadgetInfo, 
    deleteGadget, 
    selfDestructGadget 
} = require("../controllers/gadgetController");


gadgetRoutes.get("/",
    authenticateUser,
    query("status").optional({ checkFalsy: true }).isString().trim().isIn(gadgetStatus),
    getAllGadgetsBasedOnStatus
);

gadgetRoutes.post("/",
    authenticateUser, 
    createGadget
);

gadgetRoutes.patch("/:id",
    authenticateUser,
    param('id').notEmpty().trim().isUUID(),
    body('status').optional({ checkFalsy: true }).isString().trim().isIn(gadgetStatus),
    body('name').optional({ checkFalsy: true }).isString().trim().isLength({ min: 3, max: 50 }),
    updateGadgetInfo
);

gadgetRoutes.delete("/:id",
    authenticateUser,
    param('id').notEmpty().trim().isUUID(), 
    deleteGadget
);

gadgetRoutes.post('/:id/self-destruct',
    authenticateUser,
    param('id').notEmpty().trim().isUUID(),
    selfDestructGadget
);

module.exports = gadgetRoutes;