# 🚀 Complete Vercel Deployment Guide

## 📦 Files Created

✅ All necessary configuration files have been created:
- `backend/vercel.json` - Serverless function routing
- `backend/.vercelignore` - Files to exclude from deployment
- `backend/.env.example` - Environment variables template
- `frontend/vercel.json` - SPA routing configuration
- `frontend/.vercelignore` - Files to exclude from deployment

✅ `backend/server.js` has been modified to support Vercel serverless functions

---

## 🔧 STEP-BY-STEP DEPLOYMENT GUIDE

### **PART 1: Deploy Backend First**

#### 1️⃣ Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

#### 2️⃣ Deploy Backend
```bash
cd backend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → `shaya-backend` (or your preferred name)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

#### 3️⃣ Set Backend Environment Variables

After deployment, set environment variables in Vercel:

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your backend project
3. Go to **Settings → Environment Variables**
4. Add these variables:

```
MONGO_URL = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
FRONTEND_URL = https://your-frontend-app.vercel.app (set this after deploying frontend)
NODE_ENV = production
```

**Option B: Via CLI**
```bash
vercel env add MONGO_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add FRONTEND_URL
```

#### 4️⃣ Redeploy Backend with Environment Variables
```bash
vercel --prod
```

#### 5️⃣ Copy Your Backend URL
After deployment, copy the production URL (e.g., `https://shaya-backend.vercel.app`)

---

### **PART 2: Deploy Frontend**

#### 1️⃣ Create/Update Frontend Environment File

Create `frontend/.env.production` file:
```env
VITE_API_URL=https://your-backend-app.vercel.app/api
```
Replace with your actual backend URL from Step 5 above.

#### 2️⃣ Deploy Frontend
```bash
cd frontend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → `shaya-frontend` (or your preferred name)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

#### 3️⃣ Set Frontend Environment Variable

**Option A: Via Vercel Dashboard**
1. Go to your frontend project in Vercel
2. **Settings → Environment Variables**
3. Add:
```
VITE_API_URL = https://your-backend-app.vercel.app/api
```

**Option B: Via CLI**
```bash
vercel env add VITE_API_URL
```

#### 4️⃣ Deploy to Production
```bash
vercel --prod
```

#### 5️⃣ Copy Your Frontend URL
Copy the production URL (e.g., `https://shaya-frontend.vercel.app`)

---

### **PART 3: Update Backend with Frontend URL**

#### 1️⃣ Update Backend FRONTEND_URL
Go back to your backend project in Vercel Dashboard:
1. **Settings → Environment Variables**
2. Edit `FRONTEND_URL` to your actual frontend URL
3. Example: `https://shaya-frontend.vercel.app`

#### 2️⃣ Redeploy Backend
```bash
cd backend
vercel --prod
```

---

## ⚠️ IMPORTANT NOTES

### 🗂️ File Uploads Limitation
Vercel's serverless functions have a **4.5MB request body limit** and **no persistent file storage**. Your uploaded files (products, payments) will be lost on each deployment.

**Solutions:**
1. **Use Cloudinary (Recommended)** - For product images
2. **Use AWS S3** - For all file storage
3. **Use UploadThing** - Simple file uploads
4. **Use Vercel Blob** - Vercel's own storage solution

If you continue with local storage, files will be lost when functions restart.

### 📝 MongoDB Connection
- Ensure your MongoDB allows connections from **all IP addresses** (0.0.0.0/0) or whitelist Vercel's IPs
- Use MongoDB Atlas for best compatibility

### 🔄 Continuous Deployment
Once set up, Vercel will auto-deploy on every `git push` if you:
1. Connect your GitHub/GitLab repository in Vercel Dashboard
2. Push your code to the repository

---

## 🧪 Testing Your Deployment

### Test Backend
```bash
curl https://your-backend-app.vercel.app/api/health
```

Should return:
```json
{
  "uptime": 123.456,
  "status": "ok",
  "timestamp": 1706620800000,
  "database": "connected"
}
```

### Test Frontend
Visit: `https://your-frontend-app.vercel.app`

### Test API from Frontend
Open browser console and check network requests to ensure they're going to your backend URL.

---

## 🐛 Troubleshooting

### Backend Issues
1. **Database not connecting?**
   - Check MongoDB whitelist IPs
   - Verify MONGO_URL in environment variables

2. **CORS errors?**
   - Ensure FRONTEND_URL is set correctly in backend
   - Check browser console for actual error

3. **Function timeout?**
   - Vercel free tier: 10s timeout
   - Vercel Pro: 60s timeout

### Frontend Issues
1. **404 on page refresh?**
   - The `vercel.json` rewrites should handle this
   - Check if file was deployed correctly

2. **API calls failing?**
   - Verify VITE_API_URL is correct
   - Check browser Network tab for actual URL being called

3. **Environment variables not working?**
   - Vite requires `VITE_` prefix for client-side env vars
   - Redeploy after adding env variables

---

## 📊 Quick Command Reference

```bash
# Deploy to development
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

---

## ✅ Deployment Checklist

**Backend:**
- [ ] `vercel.json` created
- [ ] `server.js` modified for Vercel export
- [ ] Backend deployed to Vercel
- [ ] Environment variables set (MONGO_URL, JWT_SECRET, NODE_ENV)
- [ ] Health check endpoint working
- [ ] Backend URL copied

**Frontend:**
- [ ] `vercel.json` created
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL environment variable set
- [ ] Frontend URL copied
- [ ] Application loads correctly

**Final Steps:**
- [ ] Backend FRONTEND_URL updated with actual frontend URL
- [ ] Backend redeployed
- [ ] Full application tested
- [ ] CORS working correctly
- [ ] Authentication working
- [ ] API calls successful

---

## 🎉 You're Done!

Your MERN application should now be fully deployed on Vercel!

**Your URLs:**
- Frontend: `https://your-frontend-app.vercel.app`
- Backend: `https://your-backend-app.vercel.app`
- Backend API: `https://your-backend-app.vercel.app/api`

---

## 🔄 Future Deployments

After initial setup, deploying updates is simple:

```bash
# Backend updates
cd backend
vercel --prod

# Frontend updates
cd frontend
vercel --prod
```

Or connect to GitHub for automatic deployments on push!
