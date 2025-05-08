# User Management System - Backend

This repository contains the backend API for the User Management System, a secure user authentication and authorization system built with Node.js, Express, and Sequelize.

## Features

- Complete user authentication flow with JWT
- Account management (create, update, delete)
- Email verification with tokens
- Password reset functionality
- Role-based access control
- Secure token handling with refresh tokens
- Database integration with Sequelize

## Prerequisites

- Node.js 14+ and npm
- MySQL or PostgreSQL database

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```
     NODE_ENV=development
     SECRET=your_jwt_secret_key
     EMAIL_FROM=your_email@example.com
     SMTP_HOST=smtp.example.com
     SMTP_PORT=587
     SMTP_USER=your_smtp_username
     SMTP_PASS=your_smtp_password
     ```

4. Configure your database connection in `config.json`

5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /accounts/authenticate` - Login and get JWT token
- `POST /accounts/refresh-token` - Refresh the JWT token
- `POST /accounts/revoke-token` - Logout (revoke token)

### Registration
- `POST /accounts/register` - Register a new account
- `POST /accounts/verify-email` - Verify email using token
- `POST /accounts/forgot-password` - Request password reset
- `POST /accounts/validate-reset-token` - Validate password reset token
- `POST /accounts/reset-password` - Reset password using token

### Users
- `GET /accounts` - Get all users (admin only)
- `GET /accounts/:id` - Get user by ID
- `POST /accounts` - Create a new user (admin only)
- `PUT /accounts/:id` - Update a user
- `DELETE /accounts/:id` - Delete a user

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- CORS protection
- XSS protection
- Input validation with Joi

## Technology Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL/PostgreSQL
- JWT (jsonwebtoken)
- Nodemailer
- Joi validation
