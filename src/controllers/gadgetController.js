const Gadget = require('../models/gadgetModel');

const getAllGadgetsBasedOnStatus = async (req, res) => {
    const validStatus = ["Available", "Deployed", "Destroyed", "Decommissioned"]
    if(req.query.status){
        if(!validStatus.includes(req.query.status)) {
            return res.status(400).send({ message: 'Invalid status', success: false });
        }
    }
    
    const status  = req.query.status ? [req.query.status] : ["Available", "Deployed", "Destroyed", "Decommissioned"];

    try {
        const gadgets = await Gadget.findAll({ where: { status } });

        const formattedGadgets = gadgets.map(gadget => {
            return {
                ...gadget.dataValues,
                description: `${gadget.name} - ${Math.floor(Math.random() * 100)}% success probability`
            }
        })

        return res.status(200).send({message: "Succesfully retrieved gadgets", success: true, data: formattedGadgets});
    }catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error during retrieving gadgets", success: false, error: error.message });
    }

}

const createGadget = async (req, res) => {
    const userId  = req.userId;
    if (!userId) {
        return res.status(400).send({ message: 'User id is required', success: false });
    }

    try {
        const result = await fetch('https://random-word-form.herokuapp.com/random/animal');
        if (!result.ok) {
            return res.status(500).send({ message: 'Error fetching random name', status: false });
        }

        const jsonData = await result.json()
        const name = `The ${jsonData[0]}`
        req.gadgetName = name;
        
        const gadget = await Gadget.create({ name, userId });
        if (!gadget) {
            return res.status(500).send({ message: 'Gadget not created', status: false });
        }
        
        return res.status(201).send({ message: "Succesfully created new gadget",success: true, data: gadget });
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: `Gadget with name '${req.gadgetName}' already exists.`, success: false });
        }
        return res.status(500).send({ message: "Internal server error during create gadget", success: false, error: error.message });
    }
}

const updateGadgetInfo = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ message: 'Gadget id is required', success: false });
    }

    const { name, status } = req.body;
    if (!name && !status) {
        return res.status(400).send({ message: 'At least one of "name" or "status" is required', success: false });
    }

    try {
        const gadget = await Gadget.findByPk(id);
        if (!gadget) {
            return res.status(404).send({ message: 'Gadget not found', success: false });
        }

        gadget.name = name ? name : gadget.name;
        gadget.status = status ? status : gadget.status;
        await gadget.save();

        return res.status(200).send({ message: "Succesfully updated gadget info", success: false, data: gadget });
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: `Gadget with name '${name}' already exists.`, success: false });
        } else{
            return res.status(400).send({ message: "Internal server error during update gadget info", success: false, error: error.message });
        } 
    }
}

const deleteGadget = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ message: 'Gadget id is required', success: false });
    }

    try {
        const gadget = await Gadget.findByPk(id);
        if (!gadget) {
            return res.status(404).send({ message: 'Gadget not found', success: false });
        }

        gadget.status = 'Decommissioned'
        gadget.decommissionedAt = new Date();
        await gadget.save();

        return res.status(200).send({ message: "Succesfully decommissioned gadget", success: true, data: gadget });
    }catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error during delete gadget", success:false, error: error.message });
    }
}

const selfDestructGadget = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ message: 'Gadget id is required', success: false });
    }

    try {
        const gadget = await Gadget.findByPk(id);
        if (!gadget) {
            return res.status(404).send({ message: 'Gadget not found', success: false });
        }

       const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString(); //6 digit random number

        gadget.selfDestructCode = confirmationCode;
        await gadget.save();
        
        return res.status(200).send({ message: "Succesfully initialized self destruct of gadget", success: true, data: gadget });     
    }catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error during self destruct gadget", success: false, error: error.message });
    }
}

module.exports = {
    getAllGadgetsBasedOnStatus, 
    createGadget, 
    updateGadgetInfo, 
    deleteGadget,
    selfDestructGadget
};
