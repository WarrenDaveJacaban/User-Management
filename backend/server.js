// backend/server.js (updated CORS for Vercel)
require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./_middleware/error_handler');
const http = require('http');

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? (process.env.PORT || 80) : 4000;

// Expanded list of allowed origins including all possible Vercel domains
const allowedOrigins = [
    // Vercel domains
    'https://user-management-eight-kappa.vercel.app',
    'https://user-management-system-angular-tm8z.vercel.app',
    'https://user-management-system-angular.vercel.app',
    'https://user-management-system-angular-froillan123.vercel.app',
    // Add any new Vercel deployment domains here
    
    // Development origins
    'http://localhost:4200',
    'http://localhost:3000',
    'http://127.0.0.1:4200'
];

// Parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration with more detailed logging
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(`Request from origin: ${origin || 'unknown'}`);
    console.log(`Request path: ${req.path}`);
    console.log(`Request method: ${req.method}`);
    next();
});

// Enhanced CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
        if (!origin) {
            console.log('Request with no origin allowed');
            return callback(null, true);
        }
        
        // Check if the origin is allowed
        if (allowedOrigins.includes(origin)) {
            console.log(`Origin allowed: ${origin}`);
            callback(null, true);
        } else {
            // Check for a Vercel subdomain pattern
            if (origin.includes('vercel.app')) {
                console.log(`Dynamic Vercel origin allowed: ${origin}`);
                callback(null, true);
                
                // Add this origin to the allowed list for future requests
                if (!allowedOrigins.includes(origin)) {
                    allowedOrigins.push(origin);
                    console.log(`Added new origin to allowed list: ${origin}`);
                }
                return;
            }
            
            console.log(`CORS blocked request from: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Dynamically set allowed origin based on request
    if (origin) {
        // If it's a known origin or a Vercel domain
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            res.header('Access-Control-Allow-Origin', origin);
        }
    }
    
    // All other CORS headers
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    next();
});

// Dedicated handler for OPTIONS requests
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (origin) {
        // If it's a known origin or a Vercel domain
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            res.header('Access-Control-Allow-Origin', origin);
        }
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.sendStatus(204);
});

// API routes - wrap in try/catch to isolate errors
try {
    console.log('Loading controllers...');
    
    // Original controllers
    const accountsController = require('./accounts/accounts.controller');
    app.use('/accounts', accountsController);
    
    // New controllers
    const departmentsController = require('./departments/departments.controller');
    app.use('/departments', departmentsController);
    
    const employeesController = require('./employees/employees.controller');
    app.use('/employees', employeesController);
    
    const workflowsController = require('./workflows/workflows.controller');
    app.use('/workflows', workflowsController);
    
    console.log('Controllers loaded successfully');
} catch (error) {
    console.error('Error loading controllers:', error);
    process.exit(1);
}

// Health check endpoint for testing
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        cors: {
            allowedOrigins
        }
    });
});

// Swagger docs route - disabled to avoid path-to-regexp errors
app.use('/api-docs', (req, res) => {
    res.status(503).send('API Documentation temporarily unavailable due to path-to-regexp issues');
});

// Global error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Log environment information
console.log(`Server running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
console.log(`Server listening on port ${port}`);
console.log(`API Documentation temporarily disabled`);

server.listen(port);