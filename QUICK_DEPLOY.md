# Quick Deployment Commands

## 🚀 DEPLOY BACKEND (Run from backend folder)

```powershell
cd backend
vercel --prod
```

## 🚀 DEPLOY FRONTEND (Run from frontend folder)

```powershell
cd frontend
vercel --prod
```

## 📝 BACKEND Environment Variables (Set in Vercel Dashboard)

```
MONGO_URL = your_mongodb_atlas_connection_string
JWT_SECRET = your_secret_key_here
NODE_ENV = production
FRONTEND_URL = https://your-frontend.vercel.app
```

## 📝 FRONTEND Environment Variables (Set in Vercel Dashboard)

```
VITE_API_URL = https://your-backend.vercel.app/api
```

## ⚡ Order of Deployment

1. Deploy backend first → Get backend URL
2. Deploy frontend with backend URL in env vars
3. Update backend with frontend URL
4. Redeploy backend

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com/
