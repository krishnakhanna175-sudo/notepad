# SecureNotePad Backend

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Configure Environment Variables
Create a \`.env\` file in the backend directory and add:
\`\`\`
MONGO_URI=mongodb://localhost:27017/securenotepad
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development
\`\`\`

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Start the Server
\`\`\`bash
npm run dev
\`\`\`

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- **POST** \`/api/auth/register\` - Register new user
- **POST** \`/api/auth/login\` - Login user

### Notes (Requires JWT Token)
- **GET** \`/api/notes\` - Get all user notes
- **GET** \`/api/notes/:id\` - Get specific note
- **POST** \`/api/notes\` - Create new note
- **PUT** \`/api/notes/:id\` - Update note
- **DELETE** \`/api/notes/:id\` - Delete note

## Project Structure
\`\`\`
backend/
├── models/
│   ├── User.js
│   └── Note.js
├── routes/
│   ├── auth.js
│   └── notes.js
├── middleware/
│   └── auth.js
├── config/
│   └── database.js
├── server.js
├── package.json
└── .env
\`\`\`
