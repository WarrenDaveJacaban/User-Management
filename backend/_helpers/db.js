// Updated backend/_helpers/db.js
const config = require('../config.json');
const { Sequelize } = require('sequelize');

// Determine environment
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const envConfig = config[env];

module.exports = db = {};

initialize();

async function initialize() {
    try {
        console.log(`Using ${env} database configuration`);
        
        // Connect Sequelize with PostgreSQL using connection URL
        const sequelize = new Sequelize(envConfig.database.url, { 
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: console.log // Enable to see SQL queries
        });

        // Initialize models
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
        db.Department = require('../departments/department.model')(sequelize);
        db.Employee = require('../employees/employee.model')(sequelize);
        db.Workflow = require('../workflows/workflow.model')(sequelize);
        db.Request = require('../requests/request.model')(sequelize);
db.RequestItem = require('../requests/request-item.model')(sequelize);
        // Setup relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        
        // Employee relationships
        db.Department.hasMany(db.Employee, { foreignKey: 'departmentId' });
        db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId' });
        
        db.Account.hasOne(db.Employee, { foreignKey: 'accountId' });
        db.Employee.belongsTo(db.Account, { foreignKey: 'accountId' });
        
        // Workflow relationships
        db.Employee.hasMany(db.Workflow, { foreignKey: 'employeeId' });
        db.Workflow.belongsTo(db.Employee, { foreignKey: 'employeeId' });
        
        db.Account.hasMany(db.Workflow, { foreignKey: 'assignedTo', as: 'AssignedWorkflows' });
        db.Account.hasMany(db.Workflow, { foreignKey: 'completedBy', as: 'CompletedWorkflows' });
        
        db.Workflow.belongsTo(db.Account, { foreignKey: 'assignedTo', as: 'AssignedTo' });
        db.Workflow.belongsTo(db.Account, { foreignKey: 'completedBy', as: 'CompletedBy' });

        // Add these relationships after the other relationships
db.Account.hasMany(db.Request, { foreignKey: 'accountId' });
db.Request.belongsTo(db.Account, { foreignKey: 'accountId' });

db.Employee.hasMany(db.Request, { foreignKey: 'employeeId' });
db.Request.belongsTo(db.Employee, { foreignKey: 'employeeId' });

db.Account.hasMany(db.Request, { foreignKey: 'assignedTo', as: 'AssignedRequests' });
db.Request.belongsTo(db.Account, { foreignKey: 'assignedTo', as: 'AssignedTo' });

db.Account.hasMany(db.Request, { foreignKey: 'completedBy', as: 'CompletedRequests' });
db.Request.belongsTo(db.Account, { foreignKey: 'completedBy', as: 'CompletedBy' });
// Request Items relationship
db.Request.hasMany(db.RequestItem, { 
    foreignKey: 'requestId',
    onDelete: 'CASCADE'
});
db.RequestItem.belongsTo(db.Request, { foreignKey: 'requestId' });
        // Sync models
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
        
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}