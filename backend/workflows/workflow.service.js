// backend/workflows/workflow.service.js
const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    getByEmployee,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const workflows = await db.Workflow.findAll({
        include: [
            {
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['firstName', 'lastName'] },
                    { model: db.Department, attributes: ['name'] }
                ]
            },
            { model: db.Account, as: 'AssignedTo', attributes: ['firstName', 'lastName'] },
            { model: db.Account, as: 'CompletedBy', attributes: ['firstName', 'lastName'] }
        ]
    });
    
    return workflows.map(workflow => {
        const { ...workflowData } = workflow.get();
        return {
            ...workflowData,
            employeeName: workflow.employee && workflow.employee.account 
                ? `${workflow.employee.account.firstName} ${workflow.employee.account.lastName}` 
                : null,
            departmentName: workflow.employee && workflow.employee.department 
                ? workflow.employee.department.name 
                : null,
            assignedToName: workflow.AssignedTo 
                ? `${workflow.AssignedTo.firstName} ${workflow.AssignedTo.lastName}` 
                : null,
            completedByName: workflow.CompletedBy 
                ? `${workflow.CompletedBy.firstName} ${workflow.CompletedBy.lastName}` 
                : null
        };
    });
}

async function getById(id) {
    const workflow = await getWorkflow(id);
    return {
        ...workflow.get(),
        employeeName: workflow.employee && workflow.employee.account 
            ? `${workflow.employee.account.firstName} ${workflow.employee.account.lastName}` 
            : null,
        departmentName: workflow.employee && workflow.employee.department 
            ? workflow.employee.department.name 
            : null,
        assignedToName: workflow.AssignedTo 
            ? `${workflow.AssignedTo.firstName} ${workflow.AssignedTo.lastName}` 
            : null,
        completedByName: workflow.CompletedBy 
            ? `${workflow.CompletedBy.firstName} ${workflow.CompletedBy.lastName}` 
            : null
    };
}

async function getByEmployee(employeeId) {
    const workflows = await db.Workflow.findAll({
        where: { employeeId },
        include: [
            { model: db.Account, as: 'AssignedTo', attributes: ['firstName', 'lastName'] },
            { model: db.Account, as: 'CompletedBy', attributes: ['firstName', 'lastName'] }
        ],
        order: [['created', 'DESC']]
    });
    
    return workflows.map(workflow => {
        const { ...workflowData } = workflow.get();
        return {
            ...workflowData,
            assignedToName: workflow.AssignedTo 
                ? `${workflow.AssignedTo.firstName} ${workflow.AssignedTo.lastName}` 
                : null,
            completedByName: workflow.CompletedBy 
                ? `${workflow.CompletedBy.firstName} ${workflow.CompletedBy.lastName}` 
                : null
        };
    });
}

async function create(params) {
    // Validate employee if provided
    if (params.employeeId) {
        const employee = await db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw 'Employee not found';
        }
    }
    
    // Validate assigned account if provided
    if (params.assignedTo) {
        const account = await db.Account.findByPk(params.assignedTo);
        if (!account) {
            throw 'Assigned account not found';
        }
    }
    
    const workflow = new db.Workflow(params);
    await workflow.save();
    
    return workflow;
}

async function update(id, params, accountId) {
    const workflow = await getWorkflow(id);
    
    // Validate employee if changing
    if (params.employeeId && workflow.employeeId !== params.employeeId) {
        const employee = await db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw 'Employee not found';
        }
    }
    
    // Validate assigned account if changing
    if (params.assignedTo && workflow.assignedTo !== params.assignedTo) {
        const account = await db.Account.findByPk(params.assignedTo);
        if (!account) {
            throw 'Assigned account not found';
        }
    }
    
    // Handle status change to completed
    if (params.status === 'Completed' && workflow.status !== 'Completed') {
        params.completedBy = accountId;
        params.completedAt = new Date();
    }
    
    // Copy params to workflow and save
    Object.assign(workflow, params);
    workflow.updated = new Date();
    await workflow.save();
    
    return workflow;
}

async function _delete(id) {
    const workflow = await getWorkflow(id);
    await workflow.destroy();
}

// Helper functions

async function getWorkflow(id) {
    const workflow = await db.Workflow.findByPk(id, {
        include: [
            {
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['firstName', 'lastName'] },
                    { model: db.Department, attributes: ['name'] }
                ]
            },
            { model: db.Account, as: 'AssignedTo', attributes: ['firstName', 'lastName'] },
            { model: db.Account, as: 'CompletedBy', attributes: ['firstName', 'lastName'] }
        ]
    });
    if (!workflow) throw 'Workflow not found';
    return workflow;
}