# SecureNotePad - Full-Stack MERN Application

A secure, modern note-taking application built with the MERN stack (MongoDB, Express.js, React, Node.js) with JWT authentication and Tailwind CSS styling.

## Features

### ✅ Completed Features
1. **User Authentication**
   - Email/password registration and login
   - JWT-based session management
   - Bcrypt password hashing
   - Protected routes

2. **Note Management (CRUD)**
   - Create new notes
   - Read/display all user notes
   - Edit existing notes
   - Delete notes permanently

3. **Security**
   - Owner verification on all operations
   - Private routes requiring authentication
   - Secure JWT token handling
   - Password encryption

4. **User Interface**
   - Clean, responsive design with Tailwind CSS
   - Dark gradient backgrounds
   - Search functionality
   - Note cards with edit/delete actions
   - Modal-based note editor

5. **Database**
   - MongoDB with Mongoose ODM
   - User model with email uniqueness
   - Note model with owner references
   - Automatic timestamps

## File Structure

### Backend (/backend)
\`\`\`
server.js                 # Main Express server
models/
  ├── User.js            # User schema with password hashing
  └── Note.js            # Note schema with owner reference
routes/
  ├── auth.js            # Registration and login endpoints
  └── notes.js           # CRUD endpoints for notes
middleware/
  └── auth.js            # JWT verification middleware
config/
  └── database.js        # MongoDB connection setup
package.json             # Backend dependencies
.env                     # Environment variables (not committed)
\`\`\`

### Frontend (/client)
\`\`\`
src/
  ├── pages/
  │   ├── LoginPage.jsx       # Login form with error handling
  │   ├── RegisterPage.jsx    # Registration form
  │   └── DashboardPage.jsx   # Main note dashboard
  ├── components/
  │   ├── NoteCard.jsx        # Individual note display
  │   ├── NoteEditor.jsx      # Modal for create/edit
  │   └── ProtectedRoute.jsx  # Route guard component
  ├── utils/
  │   ├── api.js              # Axios client with auth
  │   └── auth.js             # Token management
  ├── App.jsx                 # Router configuration
  └── index.css               # Tailwind + custom styles
vite.config.js               # Vite configuration
tailwind.config.js           # Tailwind theme setup
postcss.config.js            # PostCSS configuration
package.json                 # Frontend dependencies
\`\`\`

## Technology Stack Details

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Dotenv** - Environment management

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## Authentication Flow

1. **Registration:**
   - User enters email and password
   - Backend validates input
   - Password is hashed with Bcrypt
   - User created in MongoDB
   - JWT token returned

2. **Login:**
   - User enters credentials
   - Backend retrieves user and verifies password
   - JWT token generated (7-day expiration)
   - Token stored in localStorage

3. **Protected Requests:**
   - Axios interceptor adds Authorization header
   - Backend middleware verifies JWT
   - Request processed if valid, rejected if expired

## Security Implementation

### Password Security
- Bcrypt hashing with 10 salt rounds
- Minimum 6-character requirement
- Password never stored in plain text
- Password field excluded from default queries

### Data Access Control
- Users can only access their own notes
- Backend verifies ownership on every operation
- All endpoints check user ID from JWT

### Token Security
- 7-day expiration time
- Automatic logout on token expiration
- Secure token storage in localStorage
- Token sent via Authorization header

### Input Validation
- Email format validation
- Required field checks
- Content length limits
- XSS prevention through React

## API Endpoints

### Authentication (/api/auth)
\`\`\`
POST /register    - Create new account
POST /login       - Log in user
\`\`\`

### Notes (/api/notes) - Requires JWT
\`\`\`
GET /              - Get all user notes
GET /:id           - Get specific note
POST /             - Create new note
PUT /:id           - Update note
DELETE /:id        - Delete note
\`\`\`

## Development Workflow

1. **Backend Development**
   - Modify server.js or routes
   - Changes auto-reload with nodemon
   - Test with curl or Postman

2. **Frontend Development**
   - Modify React components
   - Hot reload with Vite dev server
   - Real-time feedback in browser

3. **Database**
   - MongoDB schema changes via Mongoose
   - Pre-migration scripts can be created
   - Data persists between sessions

## Performance Considerations

- Vite provides fast development server
- React dev tools for component profiling
- Axios caching through API client
- Tailwind CSS optimized production build
- MongoDB indexes on frequently queried fields

## Future Enhancement Ideas

1. **User Features**
   - Note categories/tags
   - Note sharing between users
   - Rich text editor
   - Note pinning/favorites
   - Archive functionality

2. **Security**
   - Two-factor authentication
   - Password reset via email
   - Account recovery options
   - Activity logs/audit trail
   - Rate limiting

3. **Performance**
   - Redis caching
   - Pagination for note lists
   - Image attachment support
   - Full-text search with Elasticsearch

4. **Infrastructure**
   - Docker containerization
   - CI/CD pipeline
   - Automated testing suite
   - Monitoring and alerting
   - CDN for static assets

## Deployment Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Configure MongoDB Atlas or similar
- [ ] Set NODE_ENV=production
- [ ] Update VITE_API_URL for production
- [ ] Enable HTTPS
- [ ] Configure CORS for specific domains
- [ ] Set up error logging
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Load test the application
- [ ] Security audit

## Support & Maintenance

- Monitor application logs
- Review error tracking
- Maintain dependency updates
- Regular security audits
- Database optimization
- Performance monitoring
- User feedback collection

---

**Created:** December 2024
**Status:** Ready for local development and production deployment
**License:** MIT
