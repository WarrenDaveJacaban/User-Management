// backend/employees/employee.service.js
const db = require('../_helpers/db');
const { Op } = require('sequelize');

module.exports = {
    // existing methods...
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    generateEmployeeId,
    // new method for employee transfer
    transferEmployee
};

// New function for employee transfer
async function transferEmployee(employeeId, newDepartmentId, userId) {
    // Validate employee
    const employee = await db.Employee.findByPk(employeeId, {
        include: [
            { model: db.Department, attributes: ['name'] },
            { model: db.Account, attributes: ['firstName', 'lastName'] }
        ]
    });
    
    if (!employee) {
        throw 'Employee not found';
    }
    
    // Validate department
    const newDepartment = await db.Department.findByPk(newDepartmentId);
    if (!newDepartment) {
        throw 'Department not found';
    }
    
    // Check if it's actually a transfer (not the same department)
    if (employee.departmentId === parseInt(newDepartmentId)) {
        throw 'Employee is already in this department';
    }
    
    // Store old department info for workflow description
    const oldDepartmentName = employee.department ? employee.department.name : 'Unknown';
    const newDepartmentName = newDepartment.name;
    const employeeName = employee.account ? 
        `${employee.account.firstName} ${employee.account.lastName}` : 
        `Employee ${employee.employeeId}`;
    
    // Create workflow for the transfer
    const workflow = new db.Workflow({
        type: 'Department Transfer',
        status: 'Pending',
        description: `Transfer ${employeeName} from ${oldDepartmentName} to ${newDepartmentName}`,
        employeeId: employeeId,
        assignedTo: userId
    });
    
    // Update employee's department
    employee.departmentId = newDepartmentId;
    employee.updated = new Date();
    
    // Save both changes
    await db.sequelize.transaction(async (t) => {
        await employee.save({ transaction: t });
        await workflow.save({ transaction: t });
    });
    
    return { 
        employee, 
        workflow,
        message: `Employee transferred from ${oldDepartmentName} to ${newDepartmentName}` 
    };
}

async function getAll() {
    const employees = await db.Employee.findAll({
        include: [
            { 
                model: db.Account, 
                attributes: ['firstName', 'lastName', 'email'] 
            },
            { 
                model: db.Department, 
                attributes: ['name'] 
            }
        ]
    });
    return employees.map(employee => {
        const { ...employeeData } = employee.get();
        return {
            ...employeeData,
            accountName: employee.account ? `${employee.account.firstName} ${employee.account.lastName}` : null,
            accountEmail: employee.account ? employee.account.email : null,
            departmentName: employee.department ? employee.department.name : null
        };
    });
}

async function getById(id) {
    const employee = await getEmployee(id);
    return {
        ...employee.get(),
        accountName: employee.account ? `${employee.account.firstName} ${employee.account.lastName}` : null,
        accountEmail: employee.account ? employee.account.email : null,
        departmentName: employee.department ? employee.department.name : null
    };
}

async function create(params) {
    // Validate if account is already assigned to another employee
    if (await db.Employee.findOne({ where: { accountId: params.accountId } })) {
        throw 'Account is already assigned to another employee';
    }

    // Validate if department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department) {
        throw 'Department not found';
    }

    // Generate employee ID if not provided
    if (!params.employeeId) {
        params.employeeId = await generateEmployeeId();
    }

    // Create employee
    const employee = new db.Employee(params);
    await employee.save();

    // Create onboarding workflow
    const workflow = new db.Workflow({
        type: 'Onboarding',
        status: 'Pending',
        description: `Onboarding process for employee ${params.employeeId}`,
        employeeId: employee.id
    });
    await workflow.save();

    return {
        ...employee.get(),
        workflow: workflow.get()
    };
}

async function update(id, params) {
    const employee = await getEmployee(id);

    // Validate if account is being changed and already assigned
    if (params.accountId && employee.accountId !== params.accountId && 
        await db.Employee.findOne({ 
            where: { 
                accountId: params.accountId,
                id: { [Op.ne]: id }
            } 
        })) {
        throw 'Account is already assigned to another employee';
    }

    // Validate department if changing
    if (params.departmentId) {
        const department = await db.Department.findByPk(params.departmentId);
        if (!department) {
            throw 'Department not found';
        }
    }

    // Copy params to employee and save
    Object.assign(employee, params);
    employee.updated = new Date();
    await employee.save();

    return employee;
}

async function _delete(id) {
    const employee = await getEmployee(id);
    
    // Delete associated workflows
    await db.Workflow.destroy({ where: { employeeId: id } });
    
    // Delete employee
    await employee.destroy();
}

// Helper functions

async function getEmployee(id) {
    const employee = await db.Employee.findByPk(id, {
        include: [
            { 
                model: db.Account, 
                attributes: ['firstName', 'lastName', 'email'] 
            },
            { 
                model: db.Department, 
                attributes: ['name'] 
            }
        ]
    });
    if (!employee) throw 'Employee not found';
    return employee;
}

async function generateEmployeeId() {
    const prefix = 'EMP';
    const year = new Date().getFullYear().toString().substr(-2);
    
    // Get the highest employee ID with the current year prefix
    const lastEmployee = await db.Employee.findOne({
        where: {
            employeeId: {
                [Op.like]: `${prefix}${year}%`
            }
        },
        order: [['employeeId', 'DESC']]
    });
    
    let sequence = '001';
    if (lastEmployee) {
        const lastSequence = lastEmployee.employeeId.slice(-3);
        sequence = (parseInt(lastSequence) + 1).toString().padStart(3, '0');
    }
    
    return `${prefix}${year}${sequence}`;
}