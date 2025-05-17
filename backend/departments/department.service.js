// backend/departments/department.service.js
const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const departments = await db.Department.findAll({
        include: [
            {
                model: db.Employee,
                attributes: ['id']
            }
        ]
    });
    
    return departments.map(department => {
        const { ...departmentData } = department.get();
        return {
            ...departmentData,
            employeeCount: department.employees ? department.employees.length : 0
        };
    });
}

async function getById(id) {
    const department = await getDepartment(id);
    return department;
}

async function create(params) {
    // validate
    if (await db.Department.findOne({ where: { name: params.name } })) {
        throw `Department "${params.name}" already exists`;
    }

    const department = new db.Department(params);
    await department.save();
    
    return department;
}

async function update(id, params) {
    const department = await getDepartment(id);

    // validate
    if (params.name && department.name !== params.name && 
        await db.Department.findOne({ where: { name: params.name } })) {
        throw `Department "${params.name}" already exists`;
    }

    // copy params to department and save
    Object.assign(department, params);
    department.updated = new Date();
    await department.save();

    return department;
}

async function _delete(id) {
    const department = await getDepartment(id);
    
    // Check if department has employees
    const employeeCount = await db.Employee.count({ where: { departmentId: id } });
    if (employeeCount > 0) {
        throw `Cannot delete department with ${employeeCount} employees`;
    }
    
    await department.destroy();
}

// helper functions
async function getDepartment(id) {
    const department = await db.Department.findByPk(id);
    if (!department) throw 'Department not found';
    return department;
}