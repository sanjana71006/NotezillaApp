# Notezilla — Collaborative Educational Resource Platform

**Notezilla** is a full-stack web application built for students and faculty to share, discover, and collaborate on educational resources. Features include user authentication, resource uploads, file browsing, and admin dashboards for system oversight.

## 🎯 Features

- **User Authentication** — Sign up, login, and role-based access (Student, Faculty, Admin)
- **Resource Management** — Upload, browse, and download educational materials
- **File Uploads** — Store and serve documents, PDFs, and media with file metadata
- **Contact & Feedback** — Contact form for user inquiries
- **Admin Dashboard** — System analytics, user management, and resource oversight
- **Study Groups** — Organize collaborative study sessions
- **Discussion Forums** — Post and engage in topic-based discussions
- **Responsive UI** — Built with React + Vite for fast, modern UX

## 📁 Project Structure

```
Nfb/
├── backend/              # Node.js + Express backend
│   ├── src/
│   │   ├── index.js       # Main server entry point
│   │   ├── config/db.js   # MongoDB connection config
│   │   ├── models/        # Mongoose schemas (User, Resource, Contact, etc.)
│   │   ├── routes/        # API route handlers
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, logging, etc.
│   │   └── uploads/       # User-uploaded files (ephemeral on cloud)
│   ├── api/index.js       # Serverless wrapper for Vercel/Render
│   ├── package.json
│   └── .env               # Environment variables (not committed)
│
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/    # Reusable UI components
│   │   ├── Pages/         # Full-page views (Home, Login, Upload, etc.)
│   │   ├── context/       # React Context (Auth, Theme)
│   │   └── services/      # API client (api.js)
│   ├── vite.config.js
│   ├── package.json
│   └── .env.production    # Production API URL (for build)
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ (npm v7+)
- **MongoDB Atlas** account (free tier available)
- **Git**

### Local Development

#### 1. Clone & Install Dependencies

```bash
git clone https://github.com/sanjana71006/NotezillaApp.git
cd Nfb

# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

#### 2. Configure Environment Variables

**Backend** — Create `backend/.env`:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DBNAME=Notes
JWT_SECRET=your_super_secret_jwt_key_here_use_a_long_random_string
NODE_ENV=development
PORT=5000
```

**Frontend** — Create `frontend/.env.local` (or `.env`):

```bash
VITE_API_URL=http://localhost:5000/api
```

#### 3. Start Services

**Backend** (from `backend/`):

```bash
npm run dev
# Server runs on http://localhost:5000
```

**Frontend** (from `frontend/`, new terminal):

```bash
npm run dev
# Vite dev server runs on http://localhost:5173
```

#### 4. Access the App

- Open http://localhost:5173 in your browser
- Sign up or log in
- Explore resources, upload files, and test features

## 🔧 API Endpoints

### Authentication (`/api/auth`)

- `POST /signup` — Register a new user
- `POST /login` — User login (returns JWT token)
- `GET /me` — Get current user (requires token)
- `POST /logout` — Logout

### Resources (`/api/resources`)

- `GET /` — Fetch all resources
- `GET /:id` — Fetch a single resource
- `POST /` — Upload a new resource (multipart/form-data, requires auth)
- `DELETE /:id` — Delete a resource (requires ownership or admin)

### Contacts (`/api/contacts`)

- `POST /` — Submit a contact form

### Admin (`/api/admin`)

- `GET /users` — List all users
- `GET /analytics` — System analytics
- `PUT /users/:id/block` — Block a user
- `DELETE /users/:id` — Delete a user

*(Other endpoints: /assignments, /discussions, /study-groups, /notifications, /posts, /progress, /reports)*

## 📦 Build & Deployment

### Render Deployment

#### Backend (Web Service)

1. **Create a Web Service** on Render, connect to your GitHub repo
2. **Settings**:
   - Name: `Notezilla-backend`
   - Language: `Node`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Starter` (or upgrade as needed)

3. **Environment Variables** (set in Render dashboard):
   ```
   MONGODB_URI=your_atlas_connection_string
   MONGODB_DBNAME=Notes
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   ```

4. **Deploy** and monitor logs for `✅ MongoDB connected — database: Notes`

#### Frontend (Static Site)

1. **Create a Static Site** on Render, connect to your GitHub repo
2. **Settings**:
   - Name: `Notezilla-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://notezilla-backend-xxxxx.onrender.com/api
   ```
   *(Replace with your actual Render backend URL)*

4. **Deploy** and verify the frontend loads and connects to the backend

#### Testing Deployment

- Open your frontend URL
- In browser DevTools → Network, confirm API requests target the Render backend URL
- Test signup/login and file upload flows
- Check backend logs in Render dashboard for incoming requests

### Vercel Deployment (Alternative)

- Backend: Deploy via `backend/api/index.js` serverless wrapper
- Frontend: Deploy from `frontend/` directory
- Set same environment variables in Vercel project settings

## 📝 File Upload & Storage

### Current Implementation

- Files are uploaded to `backend/uploads/` directory
- Metadata (filename, size, type) is saved to MongoDB `Resources` collection
- Files are served statically via `/uploads/<filename>`

### ⚠️ Important Notes

- **Local filesystem is ephemeral** on cloud platforms (Render, Vercel). Files may be deleted between deploys.
- **For production**, consider migrating to S3 or another object store (see *Future Enhancements* below).

### S3 Migration (Recommended for Production)

1. Create an AWS S3 bucket
2. Add S3 credentials to backend environment:
   ```
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   S3_BUCKET_NAME=your_bucket
   S3_REGION=us-west-2
   ```
3. Update `backend/src/controllers/resourceController.js` to use AWS SDK to upload files to S3
4. Store the returned S3 URL in the `Resource` document instead of a local path

## 🔐 Security Notes

- **JWT Secret**: Use a strong, random secret in production. Rotate if exposed.
- **Database Credentials**: Never commit `.env` files. Store secrets in deployment platform's environment variables.
- **CORS**: Currently allows all origins (`cors()`). For production, restrict to your frontend domain.
- **Sensitive Data**: Remove or rotate any secrets that were accidentally committed to Git history.

## 📚 Tech Stack

**Backend**:
- Express.js (v4.18) — HTTP server
- Mongoose (v7.6) — MongoDB ODM
- JWT (jsonwebtoken) — Token-based authentication
- bcryptjs — Password hashing
- Multer — File upload handling
- CORS — Cross-origin requests
- Morgan — Request logging

**Frontend**:
- React (v19) — UI library
- Vite (v7) — Build tool & dev server
- React Router (v7) — Client-side routing
- CSS — Styled components for each page/component

## 📖 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

MIT License — See LICENSE file for details

## 🤝 Support & Contact

For issues, feature requests, or questions:
- Open an issue on [GitHub](https://github.com/sanjana71006/NotezillaApp/issues)
- Fill out the Contact form in the app

## 🔮 Future Enhancements

- [ ] S3 integration for persistent file storage
- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] Advanced search and filtering
- [ ] Email verification and password reset
- [ ] API rate limiting
- [ ] Unit and integration tests
- [ ] TypeScript migration
- [ ] Dark mode improvements
- [ ] Mobile app (React Native)

---

**Last Updated**: November 2025  
**Repo**: [sanjana71006/NotezillaApp](https://github.com/sanjana71006/NotezillaApp)  
**Live Demo**: [Notezilla Frontend](https://notezilla-frontend-xxxxx.onrender.com)
