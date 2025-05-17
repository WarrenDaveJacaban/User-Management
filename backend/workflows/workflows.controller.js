// backend/workflows/workflows.controller.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate_request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const workflowService = require('./workflow.service');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.get('/employee/:id', authorize(), getByEmployee);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    workflowService.getAll()
        .then(workflows => res.json(workflows))
        .catch(next);
}

function getById(req, res, next) {
    workflowService.getById(req.params.id)
        .then(workflow => workflow ? res.json(workflow) : res.sendStatus(404))
        .catch(next);
}

function getByEmployee(req, res, next) {
    workflowService.getByEmployee(req.params.id)
        .then(workflows => res.json(workflows))
        .catch(next);
}

function create(req, res, next) {
    workflowService.create(req.body)
        .then(workflow => res.json(workflow))
        .catch(next);
}

function update(req, res, next) {
    // Get the current user's ID from JWT token
    const accountId = req.auth.id;
    
    workflowService.update(req.params.id, req.body, accountId)
        .then(workflow => res.json(workflow))
        .catch(next);
}

function _delete(req, res, next) {
    workflowService.delete(req.params.id)
        .then(() => res.json({ message: 'Workflow deleted successfully' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid('Onboarding', 'Department Transfer', 'Request', 'Other').required(),
        status: Joi.string().valid('Pending', 'In Progress', 'Approved', 'Rejected', 'Completed').default('Pending'),
        description: Joi.string().allow(''),
        employeeId: Joi.number().allow(null),
        requestId: Joi.number().allow(null),
        assignedTo: Joi.number().allow(null)
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid('Onboarding', 'Department Transfer', 'Request', 'Other').empty(''),
        status: Joi.string().valid('Pending', 'In Progress', 'Approved', 'Rejected', 'Completed').empty(''),
        description: Joi.string().allow(''),
        employeeId: Joi.number().allow(null),
        requestId: Joi.number().allow(null),
        assignedTo: Joi.number().allow(null)
    });
    validateRequest(req, next, schema);
}