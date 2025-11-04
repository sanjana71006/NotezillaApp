Notezilla backend (Express + MongoDB Atlas)

How to use

1. Copy `.env.example` to `.env` inside `backend/` and set `MONGODB_URI` to your MongoDB Atlas connection string. Also set `JWT_SECRET` and optionally `PORT`.

2. Install dependencies:

   cd backend
   npm install

3. Run in development:

   npm run dev

Endpoints summary

- POST /api/auth/signup  -> create account
- POST /api/auth/login   -> authenticate, returns JWT
- GET  /api/auth/me      -> get current user (requires Authorization header)

- GET  /api/resources    -> list resources
- POST /api/resources    -> create resource (protected: faculty or admin), supports file upload
- GET  /api/resources/:id-> get resource
- PUT  /api/resources/:id-> update resource (protected)
- DELETE /api/resources/:id -> delete resource (admin only)

- /api/admin/* endpoints for user management and analytics (admin-only)

Notes

- This is a starting point to integrate with your frontend. The frontend should store the JWT (e.g., in memory/localStorage) and include it in the `Authorization: Bearer <token>` header.
- For production, do not store JWT in localStorage if you want improved security; consider httpOnly cookies or other strategies.
