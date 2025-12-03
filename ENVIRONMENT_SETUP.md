# Environment Variables Setup

## Local Development (.env.local)

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# MongoDB Connection String
# Get this from MongoDB Atlas dashboard
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/securenotepad?retryWrites=true&w=majority

# JWT Secret for token signing
# Generate a random string: openssl rand -base64 32
JWT_SECRET=your-random-jwt-secret-here-at-least-32-characters

# API URL for client-side requests
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

## Production (Vercel)

Add these variables in Vercel project settings under "Settings > Environment Variables":

1. **MONGODB_URI** - Your production MongoDB connection string
   - Use a dedicated MongoDB Atlas cluster for production
   - Enable IP whitelist for Vercel IPs

2. **JWT_SECRET** - A strong, random secret string
   - Generate: `openssl rand -base64 32`
   - Keep this secret and never commit to version control

3. **NEXT_PUBLIC_API_URL** - Your Vercel deployment URL
   - Example: `https://your-app.vercel.app`
   - This is public and sent to the client

## Generating Secrets

### JWT_SECRET
\`\`\`bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([byte[]]@((1..32 | % {Get-Random -Maximum 256})))
\`\`\`

## Security Best Practices

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Rotate JWT_SECRET periodically
- Use strong, random values for all secrets
- Different secrets for development and production
- Regularly review and update environment variables
