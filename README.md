# People Issue Resolver — MERN + JWT Authentication

A full-stack MERN civic grievance portal with JWT authentication, where citizens register, file complaints, and admins manage them.

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Runs at: http://localhost:5000

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at: http://localhost:5173

---

## 🔑 Auth Credentials

| Role    | Details |
|---------|---------|
| Admin   | Username: `admin` / Password: `admin123` (via /login → Admin tab) |
| Citizen | Register at `/register` with name, mobile, password |

---

## 🌐 Deploy to Netlify + Render

### Step 1 — Deploy Backend on Render
1. New Web Service → connect repo
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/peopleIssueResolver
   PORT=5000
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
6. Copy your Render URL e.g. `https://your-app.onrender.com`

### Step 2 — Set Frontend Env on Netlify
In Netlify → Site Settings → Environment Variables, add:
```
VITE_API_URL=https://your-app.onrender.com
```

### Step 3 — Deploy Frontend on Netlify
- Base directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `frontend/dist`

---

## 📁 Folder Structure

```
people-issue-resolver/
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx   ← JWT state management
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx          ← New citizen registration
│   │   │   ├── ComplaintForm.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ComplaintDetails.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ComplaintCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── api.js                    ← BASE_URL config
│   │   ├── App.jsx                   ← Protected routes
│   │   ├── main.jsx
│   │   └── style.css
│   ├── netlify.toml                  ← Netlify deploy config
│   └── public/_redirects             ← React Router fix
│
├── backend/
│   ├── middleware/auth.js            ← JWT protect/adminOnly middleware
│   ├── models/
│   │   ├── User.js                   ← User model with bcrypt
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js                   ← Register/Login/AdminLogin
│   │   └── complaints.js             ← Protected CRUD routes
│   ├── server.js
│   └── .env
```

---

## 🔌 REST API

### Auth Endpoints (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Citizen registration |
| POST | /api/auth/login | Citizen login |
| POST | /api/auth/admin/login | Admin login |
| GET | /api/auth/me | Get current user (protected) |

### Complaint Endpoints (Protected)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/complaints | Citizen | Create complaint |
| GET | /api/complaints/my | Citizen | My complaints |
| GET | /api/complaints | Admin | All complaints |
| GET | /api/complaints/stats/summary | Admin | Dashboard stats |
| GET | /api/complaints/:id | Both | Single complaint |
| PUT | /api/complaints/:id | Admin | Update status/note |
| DELETE | /api/complaints/:id | Admin | Delete complaint |

---

## 🧰 Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Axios, Context API
- **Backend**: Node.js, Express.js, JWT, bcryptjs
- **Database**: MongoDB + Mongoose
- **File Upload**: Multer
- **Deployment**: Netlify (frontend) + Render (backend) + MongoDB Atlas
