# SecureNotePad - Complete Deployment Guide

## Project Structure

\`\`\`
securenotepad/
├── backend/                   # Express.js + MongoDB backend
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── client/                    # React.js + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env
│
└── README.md
\`\`\`

## Local Development Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account

### Backend Setup

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create .env file:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Update .env with your MongoDB URI:**
   \`\`\`
   MONGO_URI=mongodb://localhost:27017/securenotepad
   JWT_SECRET=your_secure_random_key_here_change_for_production
   PORT=5000
   NODE_ENV=development
   \`\`\`

5. **Start the backend:**
   \`\`\`bash
   npm run dev
   \`\`\`

   Backend runs on: http://localhost:5000

### Frontend Setup

1. **In a new terminal, navigate to client directory:**
   \`\`\`bash
   cd client
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create .env file:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Ensure API URL is set (should already be in .env.example):**
   \`\`\`
   VITE_API_URL=http://localhost:5000/api
   \`\`\`

5. **Start the frontend:**
   \`\`\`bash
   npm run dev
   \`\`\`

   Frontend runs on: http://localhost:3000

## Production Deployment

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster and get your connection string
3. Use this connection string as your MONGO_URI in production

### Backend Deployment (Heroku, Railway, or similar)

1. **Prepare backend for deployment:**
   - Update NODE_ENV to 'production' in .env
   - Generate a strong JWT_SECRET
   - Use MongoDB Atlas connection string

2. **Deploy steps depend on your platform:**
   - Heroku: Use Procfile with \`node server.js\`
   - Railway/Render: Connect GitHub repo and set environment variables
   - AWS/DigitalOcean: Set up Node.js server and pull repository

3. **Example Procfile for Heroku:**
   \`\`\`
   web: node server.js
   \`\`\`

### Frontend Deployment (Vercel, Netlify, or similar)

1. **Build the frontend:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel (recommended for Vite):**
   - Push to GitHub
   - Connect repo to Vercel
   - Set VITE_API_URL to your backend URL

3. **Or deploy to Netlify:**
   - Build command: \`npm run build\`
   - Publish directory: \`dist\`
   - Set environment variable VITE_API_URL

## Security Best Practices

### Already Implemented:
- ✅ JWT-based authentication with 7-day expiration
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Owner verification on all note operations
- ✅ Protected routes on frontend
- ✅ Automatic token removal on 401 responses
- ✅ CORS enabled (configure allowed origins in production)
- ✅ Input validation on backend
- ✅ Password requirements (minimum 6 characters)

### Recommended Additional Security Measures:
1. **HTTPS Only** - Use HTTPS in production
2. **Rate Limiting** - Add rate limiting middleware to prevent brute force attacks
3. **CORS Configuration** - Restrict to specific frontend domains
4. **Environment Variables** - Never commit .env files
5. **Data Encryption** - Consider encrypting sensitive note content
6. **Refresh Tokens** - Implement refresh token rotation
7. **Audit Logging** - Log user activities for security monitoring
8. **SQL Injection Prevention** - Already handled by Mongoose
9. **XSS Prevention** - React sanitizes by default
10. **CSRF Protection** - Add CSRF tokens for state-changing operations

## API Endpoints Reference

### Authentication
- **POST** \`/api/auth/register\`
  - Body: \`{ email, password }\`
  - Returns: \`{ message, token, user }\`

- **POST** \`/api/auth/login\`
  - Body: \`{ email, password }\`
  - Returns: \`{ message, token, user }\`

### Notes (All require Bearer token)
- **GET** \`/api/notes\` - Get all notes
- **GET** \`/api/notes/:id\` - Get specific note
- **POST** \`/api/notes\` - Create note
  - Body: \`{ title, content }\`
- **PUT** \`/api/notes/:id\` - Update note
  - Body: \`{ title?, content?, isArchived? }\`
- **DELETE** \`/api/notes/:id\` - Delete note

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: \`mongod\`
- Check MongoDB Atlas credentials if using cloud
- Verify MONGO_URI environment variable

### CORS Errors
- Backend CORS is configured to accept all origins in development
- In production, update CORS configuration in server.js

### Token Expiration
- Tokens expire after 7 days
- User must log in again for new token

### Port Already in Use
- Backend default: 5000 - Change PORT in .env
- Frontend default: 3000 - Vite will prompt for different port

## Support & Maintenance

- Monitor API logs for errors
- Set up database backups (MongoDB Atlas has built-in backups)
- Review security practices periodically
- Keep dependencies updated: \`npm update\`
\`\`\`
\`\`\`

```text file="SECURITY_CHECKLIST.md"
# SecureNotePad - Security Implementation Checklist

## Authentication Security ✅
- [x] JWT-based stateless authentication
- [x] Bcrypt password hashing (10 salt rounds)
- [x] 7-day token expiration
- [x] Email validation before registration
- [x] Minimum 6-character password requirement
- [x] Password stored hashed, never in plain text
- [x] Authentication required for all note operations

## Data Protection ✅
- [x] Owner verification on all note CRUD operations
- [x] Users can only access their own notes
- [x] Notes permanently deleted (no soft delete)
- [x] User model excludes password from queries by default

## Frontend Security ✅
- [x] Protected routes requiring authentication
- [x] JWT token stored in localStorage
- [x] Automatic logout on 401 unauthorized
- [x] Token included in all API request headers
- [x] Form validation on login/register
- [x] Error messages don't expose sensitive information

## Backend Security ✅
- [x] CORS enabled for cross-origin requests
- [x] Input validation on all endpoints
- [x] Error handling with appropriate status codes
- [x] No sensitive information in error messages
- [x] MongoDB injection prevented by Mongoose
- [x] Authorization checks on protected routes

## Environment & Deployment ✅
- [x] Environment variables for sensitive configs
- [x] Separate .env files (never committed)
- [x] Different configs for development/production
- [x] JWT_SECRET should be strong and unique

## Recommended Enhancements (Future)
- [ ] Rate limiting on auth endpoints
- [ ] Implement refresh tokens
- [ ] Add request logging/audit trail
- [ ] Encrypt note content at rest
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add password reset functionality
- [ ] Implement account lockout after failed attempts
- [ ] Add email verification
- [ ] Implement note sharing with permission levels
- [ ] Add deletion recovery/trash bin

## Testing Checklist
- [ ] User cannot access others' notes
- [ ] Expired tokens result in login redirect
- [ ] Invalid credentials are rejected
- [ ] Deleted notes cannot be retrieved
- [ ] Updated notes reflect new content
- [ ] Search filters work correctly
- [ ] Logout properly clears authentication
\`\`\`
\`\`\`

```text file="QUICK_START.md"
# SecureNotePad - Quick Start Guide

## One-Command Setup

### Backend & Frontend Together

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd client
npm install
cp .env.example .env
npm run dev
\`\`\`

Then open: http://localhost:3000

## Default Configuration

**Backend:** http://localhost:5000
**Frontend:** http://localhost:3000
**MongoDB:** localhost:27017/securenotepad

## First Steps

1. **Create Account**
   - Go to http://localhost:3000/register
   - Enter email and password (min 6 characters)
   - Click "Sign Up"

2. **Create Your First Note**
   - Click "+ New Note"
   - Enter title and content
   - Click "Save Note"

3. **Manage Notes**
   - **Edit**: Click "Edit" on any note card
   - **Delete**: Click "Delete" on any note card
   - **Search**: Use search bar to find notes by title or content

4. **Logout**
   - Click "Logout" in top right

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Bcrypt |
| HTTP Client | Axios |

## API Testing

### Register User
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
\`\`\`

### Login User
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
\`\`\`

### Create Note (use token from login response)
\`\`\`bash
curl -X POST http://localhost:5000/api/notes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -d '{
    "title": "My First Note",
    "content": "This is my first note content"
  }'
\`\`\`

## Environment Variables

### Backend (.env)
\`\`\`
MONGO_URI=mongodb://localhost:27017/securenotepad
JWT_SECRET=your_secure_secret_key
PORT=5000
NODE_ENV=development
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

## Common Issues & Solutions

**MongoDB Connection Error**
- Ensure MongoDB is running: \`mongod\`
- Check MONGO_URI in .env

**CORS Error**
- Backend CORS is already configured
- Ensure frontend is on localhost:3000

**Port Already in Use**
- Backend: Change PORT in .env
- Frontend: Press 'y' when prompted for alternate port

**Token Expired**
- Log in again to get a new token
- Tokens expire after 7 days

## Next Steps

1. Deploy backend to Heroku/Railway/AWS
2. Deploy frontend to Vercel/Netlify
3. Update API URLs in production
4. Configure proper JWT_SECRET
5. Set up MongoDB Atlas for production database
6. Enable HTTPS for all communications
\`\`\`
