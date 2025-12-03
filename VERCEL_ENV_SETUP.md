# ENVIRONMENT SETUP INSTRUCTIONS FOR VERCEL

## 1. Add Environment Variables to Vercel

You need to add these environment variables to your Vercel project:

### Steps:
1. Go to: https://vercel.com/krishnakhanna175-8153s-projects/notepad
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

### Variable 1: MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://krishna:krishna@cluster0.blehksn.mongodb.net/?appName=Cluster0`
- **Environments:** Select all (Production, Preview, Development)
- Click **Add**

### Variable 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** (Generate a strong secret, or use): `your-super-secret-jwt-key-change-this-in-production-12345`
- **Environments:** Select all (Production, Preview, Development)
- Click **Add**

### Variable 3: NEXT_PUBLIC_API_URL (Optional but recommended)
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://notepad-jcdobgq5s-krishnakhanna175-8153s-projects.vercel.app/api`
- **Environments:** All
- Click **Add**

## 2. Redeploy After Adding Variables

After adding the environment variables:
1. Go back to your Vercel project
2. Click **Deployments** 
3. Click the **three dots (...)** on the latest deployment
4. Select **Redeploy**

Or run from your terminal:
```
vercel --prod
```

## 3. Test the Connection

After deployment, visit:
- https://notepad-jcdobgq5s-krishnakhanna175-8153s-projects.vercel.app/api/health

You should see:
```json
{
  "status": "healthy",
  "mongodb": "connected"
}
```

## 4. Troubleshooting

If login/register still fails:
- Check the browser console (F12) for error messages
- Check the Vercel function logs: https://vercel.com/krishnakhanna175-8153s-projects/notepad → Logs
- Verify MongoDB connection string is correct
- Ensure JWT_SECRET is set (it can be any string)
