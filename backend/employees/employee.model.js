// backend/employees/employee.model.js
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        employeeId: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
        position: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        hireDate: { 
            type: DataTypes.DATE, 
            allowNull: false,
            defaultValue: DataTypes.NOW 
        },
        status: { 
            type: DataTypes.ENUM('Active', 'Inactive', 'On Leave', 'Terminated'), 
            allowNull: false, 
            defaultValue: 'Active' 
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments',
                key: 'id'
            }
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'accounts',
                key: 'id'
            }
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

    return sequelize.define('employee', attributes, options);
}