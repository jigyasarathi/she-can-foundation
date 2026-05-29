# She Can Foundation — Internship Portal

A production-ready full-stack internship portal for She Can Foundation NGO.

---

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcryptjs

---

## Quick Start

### 1. Clone / Extract

```bash
cd she-can-foundation
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

---

## Environment Variables (server/.env)

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/shecan
JWT_SECRET=your_super_secret_key_here
```

---

## Sample Admin Credentials

```
Email:    admin@shecan.org
Password: SheCan@2025
```

(Seeded automatically on first backend start if no admin exists)

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/applications | Get all applications (protected) |
| GET | /api/applications/:id | Get single application (protected) |
| POST | /api/applications | Submit application |
| DELETE | /api/applications/:id | Delete application (protected) |

---

## Deployment

- **Frontend** → Vercel (set `VITE_API_URL` env var to your backend URL)
- **Backend** → Render (set all env vars in dashboard)

---

## Folder Structure

```
she-can-foundation/
├── client/          # React Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── context/
└── server/          # Express backend
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── models/
    ├── config/
    └── uploads/
```
