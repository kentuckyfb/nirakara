# Backend Deployment Guide

This guide explains how to deploy your backend server separately so the admin panel works on Vercel.

## Quick Start

### 1. Deploy Backend to Render (Free Option)

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `nirakara-backend` (or your choice)
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js`
     - **Instance Type**: Free

3. **Create data directory**:
   - In Render dashboard, go to "Environment" tab
   - The server will automatically create `data/` folder on first run
   - Upload your `products.json` and `config.json` files via the Render shell or include them in your repo

4. **Note your backend URL**:
   - After deployment, Render will give you a URL like: `https://nirakara-backend.onrender.com`
   - Copy this URL (you'll need it for Vercel)

### 2. Configure Vercel Frontend

1. **Go to your Vercel project settings**

2. **Add Environment Variable**:
   - Navigate to: Settings → Environment Variables
   - Add new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://nirakara-backend.onrender.com/api` (use your Render URL + `/api`)
     - **Environment**: Production, Preview, Development (select all)

3. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"
   - Or push a new commit to trigger automatic deployment

### 3. Test Your Admin Panel

1. Visit `https://your-site.vercel.app/admin`
2. Login with:
   - Email: `admin@nirakara.com`
   - Password: `silver`
3. Verify products load and you can create/edit/delete products

## Alternative: Railway Deployment

If you prefer Railway over Render:

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your repository
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `node index.js`
5. Copy the generated URL
6. Add to Vercel as `VITE_API_URL=https://your-project.railway.app/api`

## Local Development

For local development, the app will automatically use `http://localhost:3001/api`:

```bash
# Start both frontend and backend
npm run start

# Or separately:
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

## Troubleshooting

### Admin shows "Connection Error"
- Check that `VITE_API_URL` is set in Vercel
- Verify backend is running (visit backend URL in browser)
- Check backend logs for errors

### Images not loading
- Ensure uploaded images are stored in backend's `uploads/` directory
- Check that backend serves static files from `/uploads` route
- Verify image paths in database start with `/uploads/`

### CORS errors
- Backend already has CORS enabled in `server/index.js`
- If issues persist, check backend logs
- Ensure Vercel domain is allowed (current config allows all origins)
