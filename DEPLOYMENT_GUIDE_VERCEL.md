# Deploying Code Nudi to Vercel and Render

This project consists of two parts:
1. **Frontend**: A React/Vite application.
2. **Backend**: A Django application using WebSockets (Daphne).

Because Vercel Serverless Functions do not support long-lived WebSocket connections (required for the Interactive Terminal), we recommend a split deployment:
- **Frontend** -> **Vercel**
- **Backend** -> **Render** (or Railway/Heroku)

---

## Part 1: Deploy Backend to Render

The `render.yaml` file is already included in your project!

1. **Push your code to GitHub** (if you haven't already).
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and propose two services:
   - `codenudi-backend`
   - `codenudi-frontend` (You can disable this one if you only want to use Vercel for frontend)
   - `codenudi-db` (Postgres database)
6. Click **Apply**.
7. Once deployed, copy the **URL** of your backend service (e.g., `https://codenudi-backend.onrender.com`).

> **Note**: You will need to provide `HF_TOKEN` (Hugging Face Token) and `MONGO_URI` in the Render dashboard environment variables if they are not picked up automatically.

---

## Part 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Vercel will detect it as a separate project if looking at the root. You might need to configure the **Root Directory** settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   You MUST set these variables for the frontend to talk to your backend:

   | Name | Value | Description |
   |------|-------|-------------|
   | `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com/api` | The HTTP API URL (note `/api` at end) |
   | `VITE_WS_URL` | `wss://YOUR-BACKEND.onrender.com` | The WebSocket URL (note `wss://`) |

6. Click **Deploy**.

---

## Troubleshooting

- **CORS Errors**: If you see CORS errors in the browser console, ensure your Django backend `settings.py` includes your Vercel domain in `CORS_ALLOWED_ORIGINS` or `ALLOWED_HOSTS`. A quick fix for development is allowing all `*` but be careful for production.
- **WebSocket Connection Failed**: Check if `VITE_WS_URL` is set correctly with `wss://` (Secure WebSocket).

### Important: Configure CORS on Render
For your Vercel frontend to talk to your Render backend, you **MUST** add this environment variable in your Render Backend Dashboard:

| Key | Value |
|-----|-------|
| `CORS_ALLOWED_ORIGINS` | `https://your-vercel-project-name.vercel.app` |

*Replace the value with your actual Vercel deployment URL once you have it.*
