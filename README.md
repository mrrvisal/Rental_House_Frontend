# Rental House Frontend - Render Deployment

## Render.com Static Site (Recommended)

1. **Fork/Push to GitHub** (main branch)
2. **render.com → New → Static Site** → Connect GitHub repo
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`

✅ Auto-deploys on push.

## Environment Vars (Render Dashboard → Environment)

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

## Backend Deploy (Same Repo)

- New → Web Service → Node
- Build: `npm install`
- Start: `npm start`
- Env: Full backend .env (DB, Cloudinary)

## Preview

`npm run preview`
