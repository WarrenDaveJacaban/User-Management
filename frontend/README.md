# User Management System - Frontend

This is the frontend application for the User Management System built with Angular. It provides a complete user management interface with authentication, registration, profile management, and admin features.

## Features

- User authentication with JWT
- Account registration with email verification
- Password reset flow
- User profile management
- Admin panel for user management
- Responsive UI design

## Prerequisites

- Node.js 14+ and npm
- Angular CLI 15+

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the API URL:
   - Update `src/environments/environment.ts` and `environment.prod.ts` with your backend API URL.

4. Start the development server:
   ```
   npm start
   ```
   This will start the Angular application and open it in your default browser at `http://localhost:4200`.

## Building for Production

```
npm run build
```

This will create a production-ready build in the `dist/` folder.

## Project Structure

- `src/app/account/` - Authentication components (login, register, etc.)
- `src/app/admin/` - Admin components for user management
- `src/app/home/` - Home component and dashboard
- `src/app/profile/` - User profile components
- `src/app/_components/` - Shared components
- `src/app/_helpers/` - Helper functions and services
- `src/app/_models/` - Data models
- `src/app/_services/` - API services

## Key Components

### Account Module
- Login
- Register
- Verify Email
- Forgot Password
- Reset Password

### Admin Module
- User List
- Add User
- Edit User

### Profile Module
- View Profile
- Update Details
- Change Password

## Technology Stack

- Angular 15
- TypeScript
- RxJS
- Angular Router
- Angular Forms (Reactive Forms)
- Angular HTTP Client
