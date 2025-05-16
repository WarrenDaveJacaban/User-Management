// backend/workflows/workflow.model.js
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        type: { 
            type: DataTypes.ENUM('Onboarding', 'Department Transfer', 'Request', 'Other'), 
            allowNull: false 
        },
        status: { 
            type: DataTypes.ENUM('Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'), 
            allowNull: false, 
            defaultValue: 'Pending' 
        },
        description: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            type: DataTypes.DATE 
        }
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('workflow', attributes, options);
}