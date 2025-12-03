# SecureNotePad - Deployment Guide

## Prerequisites

- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Vercel account (free at https://vercel.com)
- Git repository (optional, but recommended)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a new cluster (M0 Free tier is available)
3. Create a database user with a strong password
4. Whitelist your IP address (or allow all IPs from 0.0.0.0/0 for development)
5. Get your connection string and replace `<username>:<password>` with your credentials
6. Example connection string:
   \`\`\`
   mongodb+srv://username:password@cluster0.mongodb.net/securenotepad?retryWrites=true&w=majority
   \`\`\`

## Step 2: Deploy to Vercel

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click "New Project" and select your repository
4. Vercel will auto-detect Next.js
5. Add environment variables in the project settings
6. Deploy!

### Option B: Deploy from CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables when prompted
\`\`\`

## Step 3: Add Environment Variables

In Vercel project settings, add these variables:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random, strong secret string (generate one: `openssl rand -base64 32`)
- `NEXT_PUBLIC_API_URL` - For production: `https://your-app.vercel.app`

## Step 4: Verify Deployment

1. Your app is now live at `your-app.vercel.app`
2. Create an account and test creating/editing/deleting notes
3. Check Vercel dashboard for logs if there are issues

## Troubleshooting

### MongoDB Connection Error
- Verify your connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

### Authentication Issues
- Clear browser cookies and localStorage
- Verify JWT_SECRET is set in Vercel
- Check browser console for API error messages

### Notes Not Loading
- Check Vercel logs: `vercel logs`
- Verify MongoDB connection is working
- Check that you're authenticated (token in localStorage)

## Production Considerations

1. **Security**: Change all placeholder secrets to strong, random values
2. **Database Backups**: Enable automatic backups in MongoDB Atlas
3. **Monitoring**: Set up Vercel analytics and error tracking
4. **Rate Limiting**: Consider adding rate limiting to API routes
5. **CORS**: Currently allows localhost - update for production domains

## Local Development

To run locally:

\`\`\`bash
# Install dependencies
npm install

# Create .env.local with your MongoDB URI and JWT_SECRET
# See .env.local example in root directory

# Run development server
npm run dev

# Visit http://localhost:3000
