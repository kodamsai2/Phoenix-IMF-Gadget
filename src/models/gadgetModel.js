const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db.js');
const User = require('./userModel.js');

const Gadget = sequelize.define('Gadget', {
        _id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        gadgetUUID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Available',
            validate: {
                isIn: [['Available', 'Deployed', 'Destroyed', 'Decommissioned']]
            }
        },
        selfDestructCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        decommissionedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
);

User.hasMany(Gadget, { foreignKey: 'userId' });
Gadget.belongsTo(User, { foreignKey: 'userId' });

module.exports = Gadget;
