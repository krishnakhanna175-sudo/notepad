# SecureNotePad

A full-stack, secure note-taking application built with Next.js, MongoDB, and Vercel.

## Features

- User authentication with JWT tokens
- Create, read, update, and delete notes
- Archive notes for organization
- Search functionality
- Secure password hashing with bcryptjs
- Responsive UI with Tailwind CSS
- Vercel deployment ready

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free)

### Local Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create `.env.local` file:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open http://localhost:3000

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   │   └── notes/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── NoteCard.tsx
│   ├── NoteEditor.tsx
│   └── Navbar.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useNotes.ts
├── lib/
│   ├── mongodb.ts
│   └── jwt.ts
├── middleware/
│   └── auth.ts
├── models/
│   ├── User.ts
│   └── Note.ts
└── .env.local
\`\`\`

## API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes

- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

All note endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## Security

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days
- All note operations verify ownership
- Input validation on all endpoints
- CORS protection

## License

MIT
