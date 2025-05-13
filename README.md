# User-Management
### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn
- Angular CLI

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/WarrenDaveJacaban/User-Management
   cd User-Management-System-Angular
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `config.json`:
   ```json
   {
     "database": {
       "url": "postgresql://postgres:your_password@your_host:5432/your_database"
     },
     "secret": "your_jwt_secret",
     "emailFrom": "your_email@gmail.com",
     "smtpOptions": {
       "host": "smtp.gmail.com", 
       "port": 465,
       "secure": true,
       "auth": {
         "user": "your_email@gmail.com",
         "pass": "your_app_password in gmail"
       }
     }
   }
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

##  Configuration

### Environment Setup
1. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```


### Email Configuration
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → App Passwords
   - Select 'Mail' and your device
   - Copy the generated password
4. Update the `SMTP_PASS` in your `.env` file with the generated password

### Database Configuration
1. Create a PostgreSQL database
2. Get your database connection URL


### Security Notes
- Keep your JWT secret key secure and unique
- Regularly rotate your email app password
- Use strong database passwords

##  API Documentation

API documentation is available at `/api-docs` when the backend server is running. Key endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /accounts/register | Register new user |
| POST | /accounts/authenticate | Login |
| POST | /accounts/verify-email | Verify email |
| POST | /accounts/forgot-password | Request password reset |
| GET | /accounts | Get all accounts (Admin) |
| PUT | /accounts/:id | Update account |

##  Deployment

### Backend Deployment (Render)
1. Create a new Web Service
2. Connect your repository
3. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add environment variables

### Docker Deployment
```bash
# Build image
docker build -t user-management-backend ./backend

# Run container
docker run -p 4000:4000 user-management-backend
```
