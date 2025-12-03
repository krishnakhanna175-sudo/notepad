# SecureNotePad Frontend

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
cd client
npm install
\`\`\`

### 2. Configure Environment Variables
Create a \`.env\` file in the client directory:
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 3. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`

The app will run on http://localhost:3000

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

## Project Structure
\`\`\`
client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
\`\`\`
\`\`\`
