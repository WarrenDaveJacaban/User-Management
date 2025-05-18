// backend/requests/requests.controller.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate_request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const requestService = require('./request.service');

// Routes
router.get('/', authorize(), getAll);
router.get('/my-requests', authorize(), getMyRequests);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

// Route functions
function getAll(req, res, next) {
    // Admin users can view all requests
    if (req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    requestService.getAll()
        .then(requests => res.json(requests))
        .catch(next);
}

function getMyRequests(req, res, next) {
    // Users can view their own requests
    const accountId = req.auth.id;
    
    requestService.getAllByUser(accountId)
        .then(requests => res.json(requests))
        .catch(next);
}

function getById(req, res, next) {
    requestService.getById(req.params.id)
        .then(request => {
            // Users can only view their own requests, unless they are admin
            if (request.accountId !== req.auth.id && req.user.role !== Role.Admin) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            res.json(request);
        })
        .catch(next);
}

function create(req, res, next) {
    // Get the user ID from the JWT token
    const accountId = req.auth.id;
    
    requestService.create(req.body, accountId)
        .then(request => res.json(request))
        .catch(next);
}

function update(req, res, next) {
    // Get the user ID from the JWT token
    const accountId = req.auth.id;
    
    requestService.update(req.params.id, req.body, accountId)
        .then(request => res.json(request))
        .catch(next);
}

function _delete(req, res, next) {
    // Get the user ID from the JWT token
    const accountId = req.auth.id;
    
    requestService.delete(req.params.id, accountId)
        .then(() => res.json({ message: 'Request deleted successfully' }))
        .catch(next);
}

// Validation schemas
function createSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid('Equipment', 'Leave', 'Resource', 'Other').required(),
        title: Joi.string().required(),
        description: Joi.string().allow(''),
        assignedTo: Joi.number().allow(null),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().integer().min(1).default(1),
                description: Joi.string().allow('')
            })
        ).min(1).required()
    });
    
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        status: Joi.string().valid('Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'),
        title: Joi.string(),
        description: Joi.string().allow(''),
        assignedTo: Joi.number().allow(null),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().integer().min(1).default(1),
                description: Joi.string().allow('')
            })
        ).min(1)
    });
    
    validateRequest(req, next, schema);
}