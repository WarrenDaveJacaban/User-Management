// backend/employees/employees.controller.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate_request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const employeeService = require('./employee.service');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    employeeService.getAll()
        .then(employees => res.json(employees))
        .catch(next);
}

function getById(req, res, next) {
    employeeService.getById(req.params.id)
        .then(employee => employee ? res.json(employee) : res.sendStatus(404))
        .catch(next);
}

function create(req, res, next) {
    employeeService.create(req.body)
        .then(employee => res.json(employee))
        .catch(next);
}

function update(req, res, next) {
    employeeService.update(req.params.id, req.body)
        .then(employee => res.json(employee))
        .catch(next);
}

function _delete(req, res, next) {
    employeeService.delete(req.params.id)
        .then(() => res.json({ message: 'Employee deleted successfully' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.string().empty(''),
        position: Joi.string().required(),
        hireDate: Joi.date().default(Date.now),
        status: Joi.string().valid('Active', 'Inactive', 'On Leave', 'Terminated').default('Active'),
        departmentId: Joi.number().required(),
        accountId: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.string().empty(''),
        position: Joi.string().empty(''),
        hireDate: Joi.date().empty(''),
        status: Joi.string().valid('Active', 'Inactive', 'On Leave', 'Terminated').empty(''),
        departmentId: Joi.number().empty(''),
        accountId: Joi.number().empty('')
    });
    validateRequest(req, next, schema);
}