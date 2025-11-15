# 🏠 RentWise – AI-Enhanced Blockchain Secured Rental Platform 🔐

> **Revolutionizing the rental ecosystem with blockchain security and AI-powered intelligence.**

---

## 🌟 Overview

**RentWise** is a next-generation **decentralized SaaS rental platform** designed to bring **trust, transparency, and automation** into the property rental process.  
It leverages **blockchain** for tamper-proof rental agreements and **AI/NLP** models for intelligent sentiment analysis of user reviews — helping tenants and owners make data-driven, confident decisions.

> 💡 *Private repository — includes full codebase, demos, and visual walkthroughs.*

---

## 🚀 Key Features

- 🔐 **Blockchain-Secured Agreements** – Smart contracts ensure immutability and transparency of all rental deals.  
- 🤖 **AI-Driven Review Analysis** – NLP models classify user feedback into positive, negative, or neutral sentiments.  
- 🏘️ **Smart Listing & Discovery** – Role-based dashboard for tenants and owners with dynamic rental listings.  
- 📄 **Agreement Management** – Securely create, verify, and manage blockchain-stored rental contracts.  
- 📊 **Analytics Dashboard** – Real-time metrics on rental income, occupancy, and agreement status.  
- 📱 **Cross-Platform Access** – Fully responsive web & mobile apps with modern UI/UX.  

---

## 🧠 Problem Statement

Traditional rental systems often suffer from:

- Lack of transparency and trust  
- Manual, error-prone documentation  
- Fake or unverifiable agreements  
- Biased or unvalidated user reviews  
- Dependency on middlemen and recurring commissions  

These issues cause financial losses and frustration for tenants and property owners alike.

---

## ✅ Solution

**RentWise** solves these problems by merging **Blockchain + AI**:
- ⛓️ Blockchain ensures **secure, immutable rental agreements**
- 🤖 AI validates and classifies **real user experiences**
- 🧩 Role-based dashboards for **owners, tenants, and admins**
- 📈 Advanced analytics for **data-driven insights**

---

## ⚙️ Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Blockchain** | Smart Contracts (Ethereum / Solana Compatible) |
| **AI / NLP** | Sentiment Analysis using BERT & Text Classification |
| **Deployment** | Vercel, Render, Docker, MongoDB Atlas |

---

## 🐳 Dockerized Backend + AI Stack

Spin up the entire backend (Express API + MongoDB + Socket.IO + AI sentiment microservice) locally or on any Docker-compatible host:

1. Create a `docker/.env` file and populate it with your secrets. Example:
   ```
   SESSION_SECRET=super-secret-session
   JWT_API_SECRET_KEY=super-secret-jwt
   ADMIN_EMAIL=admin@rentwise.local
   ADMIN_PASSWORD=AdminPass123!
   CLIENT_URL=http://localhost:4000
   ALLOWED_ORIGINS=http://localhost:4000
   SOCKET_ALLOWED_ORIGINS=http://localhost:4000
   UPLOADS_DIR=/app/server/uploads
   AI_MODEL_PORT=http://sentiment:5000
   DB_URL=mongodb://mongodb:27017/rentwise
   ```
2. Build and run all services (MongoDB, Flask sentiment API, Express backend) with one command:
   ```bash
   docker compose --env-file docker/.env up --build
   ```
3. The backend becomes available at `http://localhost:3600`, the AI service at `http://localhost:5000`, and MongoDB is reachable on the internal network as `mongodb:27017`. Uploaded media persists under `server/uploads` via a bind mount.

This same compose stack works on Render’s free tier or any VPS—just provide the real environment values and point your frontend (`VITE_BACK_END_URL`, `VITE_SOCKET_URL`) to the published backend URL.

---

## ☁️ Deployment Flow (Vercel + Render/Docker host)

1. **Backend + AI (Render or any Docker host)**
   - Use the provided `docker-compose.yml` to launch:
     - `backend`: Node/Express + Socket.IO server
     - `sentiment`: Flask/Gunicorn AI microservice
     - `mongodb`: MongoDB 6 with a persistent volume
   - Mount a disk for `server/uploads` and set the env variables listed above (`SESSION_SECRET`, `JWT_API_SECRET_KEY`, SMTP creds, push keys, etc.).
   - Update `CLIENT_URL`, `ALLOWED_ORIGINS`, and `SOCKET_ALLOWED_ORIGINS` to match your Vercel domain(s).

2. **Frontend (Vercel)**
   - Deploy the `client` directory with the standard Vite build (`npm install && npm run build`).
   - Set `VITE_BACK_END_URL` and `VITE_SOCKET_URL` to the public backend URL (HTTPS).
   - Optional: configure `VITE_FRONT_END_URL` so backend-generated links (agreements, emails) point to the live site.

3. **Verification**

---

## 📦 Deployment Playbook

See `DEPLOYMENT.md` for a step-by-step checklist covering:
- Environment variable requirements
- Docker Compose setup (local or VPS)
- Render (free tier) configuration
- Vercel frontend deployment
   - Hit `GET /health` on both backend and AI services.
   - Upload a listing/photo to verify the persistent disk.
   - Submit a review to ensure the backend calls `AI_MODEL_PORT/predict` successfully.
   - Exercise chat + notifications to confirm Socket.IO works over HTTPS.

---

## 🎥 Demo Walkthroughs

### 🔐 Sign In / Register
https://github.com/user-attachments/assets/ae323c29-6c47-45c9-8d47-ac10c2a212b3  

https://github.com/user-attachments/assets/bc63bd56-0443-4fdc-988e-d50373cb078d  

### 🔑 Google Login / Password Reset
https://github.com/user-attachments/assets/5d119796-1e03-4b79-8b7c-6c7ab0a41855  

https://github.com/user-attachments/assets/9e9fdad5-549e-43c4-a298-2aac3e808e35  

### ⚙️ Account Setup
https://github.com/user-attachments/assets/4406e950-ace0-4f58-8fe6-c52448a0cf6b  

https://github.com/user-attachments/assets/c339342b-aae1-43ab-8aee-9c71474ce4b6  

### 🏠 Listings
https://github.com/user-attachments/assets/0160196f-2488-41ab-ae99-cd2ba2b20a07  

https://github.com/user-attachments/assets/d0eae83c-cc1b-4778-b5b9-378fde6f8dbd  

https://github.com/user-attachments/assets/592facb1-0a24-4d06-a8b0-fe0353735ad6  

### 💬 Chats
https://github.com/user-attachments/assets/140e1848-8996-4ae0-a252-9827d9c23266  


### 📄 Agreements
> *(Full video available on request — demonstrates blockchain-secured agreement creation and verification.)*

### 🤖 AI-Powered Review Analysis
https://github.com/user-attachments/assets/7217a13e-55da-4b42-92ca-602a5d5222ac  

### 🧑‍💼 Admin Controls (Blockchain, Role Management, etc.)
https://github.com/user-attachments/assets/bf64d591-62b0-4de3-9291-687c02bb4751  

---

## 👥 Target Users

- 🧑‍🎓 **Students & Outstation Tenants**  
- 🏡 **Property Owners / Landlords**  
- 🏢 **Rental Agencies & Admission Offices**  

---

## 🏁 Final Remarks

**RentWise** unites blockchain transparency with AI-driven intelligence to redefine the rental experience — secure, smart, and scalable.  
Future upgrades include **identity verification**, **dispute resolution**, and **global integration**.

---

📩 **For Collaboration or Demo Requests:**  
Feel free to reach out via **GitHub** or **email** for private demo access or partnership discussions.

---

⭐ *If you like this project, consider starring the repo to show your support!*
