# RentWise Deployment Guide

This document captures everything you need to deploy the RentWise stack (backend + AI microservice + frontend) using only free-tier resources.

---

## 1. Environment Variables

Create a shared `.env` (or Render/Vercel env entries) with the following keys. Values shown are placeholders—replace with real secrets.

| Key | Description |
| --- | --- |
| `DB_URL` | MongoDB connection string (Atlas or local). |
| `SESSION_SECRET` | Express session secret. |
| `JWT_API_SECRET_KEY` | JWT signing key. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Credentials for auto-seeded admin. |
| `CLIENT_URL` | Public frontend URL (Vercel). |
| `ALLOWED_ORIGINS`, `SOCKET_ALLOWED_ORIGINS` | Comma-separated origins permitted by CORS/socket. |
| `UPLOADS_DIR` | Absolute path for media uploads. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | SMTP transport configuration. |
| `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` | VAPID keys for push notifications. |
| `COOKIE_DOMAIN` | Optional cookie scope (frontend domain). |
| `AI_MODEL_PORT` | URL to the sentiment API (`http://sentiment:5000` when using Docker). |
| `SENTIMENT_MODEL_PATH`, `SENTIMENT_VECTORIZER_PATH` | (optional) override model locations. |
| `SENTIMENT_SERVICE_HOST`, `SENTIMENT_SERVICE_PORT` | Host/port for Flask service (default 0.0.0.0:5000). |

Frontend env (Vercel):
```
VITE_BACK_END_URL=https://your-backend.example.com
VITE_SOCKET_URL=https://your-backend.example.com
VITE_FRONT_END_URL=https://your-frontend.vercel.app
```

---

## 2. Local Docker Compose (free, works on any VPS)

1. Create `docker/.env` (copy the template from README or craft manually).
2. Run the full stack:
   ```bash
   docker compose --env-file docker/.env up --build
   ```
   Services:
   - `backend` (Node/Express/Socket.IO) → http://localhost:3600
   - `sentiment` (Flask/Gunicorn AI) → http://localhost:5000
   - `mongodb` (Mongo 6) with persistent volume `mongo-data`
   - Uploads stored under `server/uploads` (bind mount)
3. Test:
   - `curl http://localhost:3600/health`
   - `curl http://localhost:5000/health`
   - Upload a file via the UI to confirm disk persistence.

Use this same compose stack on Render, Fly.io (with buy-on-demand volume), or any VM (AWS Lightsail, DigitalOcean droplet) with zero code changes.

---

## 3. Backend on Render (free tier)

### Option A – Docker Compose (recommended)
- Use Render’s “Blueprint” (Infrastructure as Code) or manual service creation.
- Upload the repo to GitHub.
- Render YAML (example):
  ```yaml
  services:
    - type: web
      name: rentwise-backend
      env: docker
      region: oregon
      plan: free
      dockerfilePath: ./docker/backend.Dockerfile
      envVars:
        - key: PORT
          value: 3600
        # ... other env vars
      disk:
        name: uploads
        mountPath: /app/server/uploads
        sizeGB: 1
    - type: private_service
      name: rentwise-sentiment
      env: docker
      dockerfilePath: ./docker/sentiment.Dockerfile
      envVars:
        - key: SENTIMENT_SERVICE_PORT
          value: 5000
    - type: private_service
      name: rentwise-mongo
      env: image
      image:
        url: docker.io/library/mongo:6
      disk:
        name: mongo-data
        mountPath: /data/db
  ```
- Update `AI_MODEL_PORT` on the backend to `http://rentwise-sentiment:5000`.

### Option B – Render Native Builds (no Docker)
1. **Backend Web Service**
   - Root: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Add 1 GB disk at `/var/data/uploads` and set `UPLOADS_DIR=/var/data/uploads`.
2. **Sentiment Service**
   - Type: Background Worker or Private Service
   - Root: `server/ai/python`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn sentiment_model:app --bind 0.0.0.0:5000`
3. **MongoDB**
   - Use MongoDB Atlas free tier and set `DB_URL`.
4. Set all env vars listed earlier.

---

## 4. Frontend on Vercel (free tier)

1. Connect the `client` directory.
2. Build command: `npm install && npm run build`.
3. Set env vars:
   ```
   VITE_BACK_END_URL=https://<render-backend>.onrender.com
   VITE_SOCKET_URL=https://<render-backend>.onrender.com
   VITE_FRONT_END_URL=https://<your-vercel-app>.vercel.app
   ```
4. After deployment, update `CLIENT_URL`, `ALLOWED_ORIGINS`, and `SOCKET_ALLOWED_ORIGINS` on the backend to the new Vercel origin(s).

---

## 5. Post-deploy Verification

1. **Health checks**
   - Backend: `GET https://<backend>/health`
   - Sentiment: `POST https://<backend>/ai-health` (or directly to the service if exposed)
2. **Auth sanity**
   - Register/login via web UI; confirm cookies (`jwt`) are `httpOnly`, `secure`, `sameSite` per env.
3. **Uploads**
   - Create a listing with media files; verify files land in the persistent disk.
4. **Notifications / Socket.IO**
   - Open two browsers, start a chat; confirm real-time messages.
5. **Sentiment scoring**
   - Submit a review; check backend logs to confirm `AI_MODEL_PORT/predict` calls succeed.

---

## 6. Handy Commands

| Action | Command |
| --- | --- |
| Run backend locally | `cd server && npm install && npm start` |
| Run sentiment API locally | `cd server && npm run model` |
| Local Docker stack | `docker compose --env-file docker/.env up --build` |
| Tear down Docker stack | `docker compose down` |
| Build frontend | `cd client && npm install && npm run build` |

---

## 7. Troubleshooting

- **CORS errors** → Ensure `CLIENT_URL`, `ALLOWED_ORIGINS`, and `SOCKET_ALLOWED_ORIGINS` match the actual frontend origin (include `https://`).
- **Uploads missing** → Confirm `UPLOADS_DIR` points to a writable path and that the disk is mounted (Render disk or Docker volume).
- **Sentiment warnings** → If scikit-learn version mismatch appears, re-train/export the pickles under the same version (`python -m pip install scikit-learn==1.5.2`, re-run `preprocess.py`).
- **Render cold start** → Free tier sleeps after 15 min of inactivity; first request may take a few seconds to wake up.

---

## ✅ Easiest Path (Follow These Steps)

1. **Prepare Env Secrets**
   - Duplicate `docker/.env` from the example list and fill in real values.

2. **Run `docker compose` Locally**
   - `docker compose --env-file docker/.env up --build`
   - Verify backend (`http://localhost:3600`) and AI service.

3. **Deploy Backend Stack to Render (free)**
   - Use the same compose setup or Render Blueprint.
   - Mount a disk for `/app/server/uploads`.

4. **Deploy Frontend to Vercel**
   - Set `VITE_BACK_END_URL` + `VITE_SOCKET_URL` to the Render URL.

5. **Smoke Test**
   - Health endpoints, login, upload, chat, sentiment review.

Stick to these five steps and you’ll have both frontend (Vercel) and backend+AI (Render/Docker) live for free.

---

> Need help? Open an issue or ping in the project chat with the deployment step you’re on and the error/logs you see. Happy shipping!

