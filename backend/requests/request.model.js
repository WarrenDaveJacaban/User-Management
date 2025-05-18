// backend/requests/request.model.js
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        requestNumber: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
        type: { 
            type: DataTypes.ENUM('Equipment', 'Leave', 'Resource', 'Other'), 
            allowNull: false 
        },
        status: { 
            type: DataTypes.ENUM('Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'), 
            allowNull: false, 
            defaultValue: 'Pending' 
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'id'
            }
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'accounts',
                key: 'id'
            }
        },
        completedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'accounts',
                key: 'id'
            }
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created: { 
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW 
        },
        updated: { 
            type: DataTypes.DATE,
            allowNull: true
        }
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('request', attributes, options);
}