// backend/requests/request.service.js - continuing
const db = require('../_helpers/db');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getAllByUser,
    getById,
    create,
    update,
    delete: _delete,
    generateRequestNumber
};

async function getAll() {
    const requests = await db.Request.findAll({
        include: [
            { 
                model: db.Account, 
                attributes: ['firstName', 'lastName', 'email'] 
            },
            { 
                model: db.Employee,
                include: [
                    { model: db.Department, attributes: ['name'] }
                ] 
            },
            { model: db.Account, as: 'AssignedTo', attributes: ['firstName', 'lastName'] },
            { model: db.Account, as: 'CompletedBy', attributes: ['firstName', 'lastName'] },
            { model: db.RequestItem }
        ],
        order: [['created', 'DESC']]
    });
    
    return requests.map(request => {
        const { ...requestData } = request.get();
        return {
            ...requestData,
            requestorName: request.account ? `${request.account.firstName} ${request.account.lastName}` : null,
            requestorEmail: request.account ? request.account.email : null,
            departmentName: request.employee && request.employee.department ? request.employee.department.name : null,
            assignedToName: request.AssignedTo ? `${request.AssignedTo.firstName} ${request.AssignedTo.lastName}` : null,
            completedByName: request.CompletedBy ? `${request.CompletedBy.firstName} ${request.CompletedBy.lastName}` : null,
            items: request.requestItems
        };
    });
}

async function getAllByUser(accountId) {
    const requests = await db.Request.findAll({
        where: { accountId },
        include: [
            { model: db.Account, as: 'AssignedTo', attributes: ['firstName', 'lastName'] },
            { model: db.Account, as: 'CompletedBy', attributes: ['firstName', 'lastName'] },
            { model: db.RequestItem }
        ],
        order: [['created', 'DESC']]
    });
    
    return requests.map(request => {
        const { ...requestData } = request.get();
        return {
            ...requestData,
            assignedToName: request.AssignedTo ? `${request.AssignedTo.firstName} ${request.AssignedTo.lastName}` : null,
            completedByName: request.CompletedBy ? `${request.CompletedBy.firstName} ${request.CompletedBy.lastName}` : null,
            items: request.requestItems
        };
    });
}

async function getById(id) {
    const request = await getRequest(id);
    
    return {
        ...request.get(),
        requestorName: request.account ? `${request.account.firstName} ${request.account.lastName}` : null,
        requestorEmail: request.account ? request.account.email : null,
        departmentName: request.employee && request.employee.department ? request.employee.department.name : null,
        assignedToName: request.AssignedTo ? `${request.AssignedTo.firstName} ${request.AssignedTo.lastName}` : null,
        completedByName: request.CompletedBy ? `${request.CompletedBy.firstName} ${request.CompletedBy.lastName}` : null,
        items: request.requestItems
    };
}

async function create(params, accountId) {
    // Generate a unique request number
    params.requestNumber = await generateRequestNumber();
    
    // Set the account ID from the authenticated user
    params.accountId = accountId;
    
    // Find employee associated with the account
    const employee = await db.Employee.findOne({ where: { accountId } });
    if (employee) {
        params.employeeId = employee.id;
    }
    
    // Extract items from the request
    const items = params.items || [];
    delete params.items;
    
    // Create the request
    const request = new db.Request(params);
    
    // Save everything in a transaction
    const result = await db.sequelize.transaction(async (t) => {
        await request.save({ transaction: t });
        
        // Save all request items
        for (const item of items) {
            const requestItem = new db.RequestItem({
                ...item,
                requestId: request.id
            });
            await requestItem.save({ transaction: t });
        }
        
        // Create a workflow for the request
        const workflow = new db.Workflow({
            type: 'Request',
            status: 'Pending',
            description: `${params.type} Request: ${params.title}`,
            employeeId: params.employeeId,
            assignedTo: params.assignedTo
        });
        await workflow.save({ transaction: t });
        
        return request;
    });
    
    // Reload the request with all items
    return await db.Request.findByPk(result.id, {
        include: [
            { model: db.RequestItem }
        ]
    });
}

async function update(id, params, accountId) {
    const request = await getRequest(id);
    
    // Check if the user can update this request
    if (request.accountId !== accountId && params.status === 'Pending') {
        // Only the owner can edit a pending request
        throw 'You do not have permission to update this request';
    }
    
    // Handle request item updates if they exist
    const items = params.items;
    delete params.items;
    
    await db.sequelize.transaction(async (t) => {
        // Update request details
        Object.assign(request, {
            ...params,
            updated: new Date()
        });
        
        // If status changed to Completed, update completed fields
        if (params.status === 'Completed' && request.status !== 'Completed') {
            request.completedBy = accountId;
            request.completedAt = new Date();
        }
        
        await request.save({ transaction: t });
        
        // Update items if provided
        if (items && Array.isArray(items)) {
            // Delete all existing items first
            await db.RequestItem.destroy({
                where: { requestId: request.id },
                transaction: t
            });
            
            // Create new items
            for (const item of items) {
                const requestItem = new db.RequestItem({
                    ...item,
                    requestId: request.id
                });
                await requestItem.save({ transaction: t });
            }
        }
    });
    
    // Return the updated request with items
    return await db.Request.findByPk(id, {
        include: [
            { model: db.RequestItem }
        ]
    });
}

async function _delete(id, accountId) {
    const request = await getRequest(id);
    
    // Only allow deleting own requests or admin users
    // For simplicity, we're not checking admin role here
    if (request.accountId !== accountId) {
        throw 'You do not have permission to delete this request';
    }
    
    // Delete all related items and the request
    await db.sequelize.transaction(async (t) => {
        await db.RequestItem.destroy({
            where: { requestId: request.id },
            transaction: t
        });
        
        await request.destroy({ transaction: t });
    });
}

// Helper functions
async function getRequest(id) {
    const request = await db.Request.findByPk(id, {
        include: [
            { 
                model: db.Account, 
                attributes: ['firstName', 'lastName', 'email'] 
            },
            { 
                model: db.Employee,
                include: [
                    { model: db.Department, attributes: ['name'] }
                ]
            },
            { model: db.Account, as: 'AssignedTo', attributes: ['firstName', 'lastName'] },
            { model: db.Account, as: 'CompletedBy', attributes: ['firstName', 'lastName'] },
            { model: db.RequestItem }
        ]
    });
    
    if (!request) throw 'Request not found';
    return request;
}

async function generateRequestNumber() {
    const prefix = 'REQ';
    const year = new Date().getFullYear().toString().substr(-2);
    
    // Get the highest request number with the current year prefix
    const lastRequest = await db.Request.findOne({
        where: {
            requestNumber: {
                [Op.like]: `${prefix}${year}%`
            }
        },
        order: [['requestNumber', 'DESC']]
    });
    
    let sequence = '001';
    if (lastRequest) {
        const lastSequence = lastRequest.requestNumber.slice(-3);
        sequence = (parseInt(lastSequence) + 1).toString().padStart(3, '0');
    }
    
    return `${prefix}${year}${sequence}`;
}