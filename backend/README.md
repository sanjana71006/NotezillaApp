# Notezilla Backend

Express.js + MongoDB backend for the Notezilla collaborative resource platform.

## 🏗️ Architecture

- **Server**: Express.js HTTP API
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **File Uploads**: Multer (multipart/form-data)
- **Logging**: Morgan
- **Deployment**: Render, Vercel, or any Node.js hosting

## 📋 Prerequisites

- Node.js v16+ (npm v7+)
- MongoDB Atlas account (or local MongoDB)
- Environment variables configured (see below)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DBNAME=Notes

# JWT Secret (use a long random string)
JWT_SECRET=your_super_secret_key_here_generate_a_random_string

# Optional
NODE_ENV=development
PORT=5000

# For S3 uploads (optional)
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret
# S3_BUCKET_NAME=your_bucket_name
# S3_REGION=us-west-2
```

### 3. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000` and monitor for changes via Nodemon.

### 4. Run Production Server

```bash
npm start
```

## 📁 Project Structure

```
src/
├── index.js                 # Main server entry point
├── config/
│   └── db.js               # MongoDB connection config
├── models/
│   ├── User.js             # User schema
│   ├── Resource.js         # Uploaded resource metadata
│   ├── ContactMessage.js   # Contact form submissions
│   └── ...                 # Other schemas
├── controllers/
│   ├── authController.js   # Auth logic (signup, login, me)
│   ├── resourceController.js # Resource upload/fetch logic
│   ├── contactController.js # Contact form logic
│   └── adminController.js  # Admin operations
├── routes/
│   ├── auth.js             # Auth endpoints
│   ├── resources.js        # Resource endpoints
│   ├── contacts.js         # Contact endpoints
│   ├── admin.js            # Admin endpoints
│   └── ...                 # Other route files
├── middleware/
│   └── auth.js             # JWT verification middleware
└── uploads/                # User-uploaded files (local filesystem)

api/
└── index.js                # Serverless wrapper for Vercel/Render
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/signup` — Register a new user
  - Body: `{ email, password, name, role }`
  - Returns: `{ token, user }`

- `POST /api/auth/login` — Log in
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- `GET /api/auth/me` — Get current user (requires token)
  - Header: `Authorization: Bearer <token>`
  - Returns: `{ user }`

- `POST /api/auth/logout` — Logout

### Resources

- `GET /api/resources` — Fetch all resources

- `GET /api/resources/:id` — Fetch a single resource

- `POST /api/resources` — Upload a new resource (multipart/form-data)
  - Header: `Authorization: Bearer <token>`
  - Body: form data with `file` field
  - Returns: `{ resource }`

- `DELETE /api/resources/:id` — Delete a resource (requires ownership or admin)

### Contacts

- `POST /api/contacts` — Submit a contact form
  - Body: `{ name, email, category, message }`
  - Returns: `{ contactMessage }`

### Health Check

- `GET /api/health` — Server health check
  - Returns: `{ ok: true }`

## 🔐 Authentication Flow

1. User signs up or logs in via `/auth/signup` or `/auth/login`
2. Backend validates credentials and returns a JWT token
3. Frontend stores token in localStorage
4. Frontend includes token in subsequent requests: `Authorization: Bearer <token>`
5. Middleware (`auth.js`) verifies token on protected routes

## 📤 File Upload Flow

1. User submits a file via `POST /api/resources` (multipart/form-data)
2. Multer middleware receives the file and stores it in `uploads/` directory
3. Backend captures file metadata (name, size, type) and saves to MongoDB `Resources` collection
4. Frontend can fetch and display the resource, including a link to the uploaded file

### Local File Storage

Files are stored in `backend/uploads/` and served statically at `/uploads/<filename>`. However, on cloud platforms like Render, the filesystem is ephemeral — files may be deleted between deploys.

### S3 Migration (Recommended)

For persistent file storage, migrate to AWS S3:

1. Create S3 bucket and add credentials to `.env`
2. Update `resourceController.js` to stream files to S3
3. Store returned S3 URL in MongoDB instead of local path

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (Student | Faculty | Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Resources Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  uploadedBy: ObjectId (User),
  fileUrl: String,
  fileSize: Number,
  fileType: String,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ContactMessages Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  category: String,
  message: String,
  createdAt: Date
}
```

## 🚀 Deployment

### Render

1. Create a **Web Service** on Render connected to your GitHub repo
2. Set **Root Directory** to `backend`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `npm start`
5. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
6. Deploy and monitor logs

### Vercel

1. Use serverless wrapper in `api/index.js`
2. Configure `vercel.json` to route API requests to serverless functions
3. Deploy frontend and backend together
4. Set environment variables in Vercel dashboard

## 🧪 Testing Endpoints

Test endpoints manually with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test User","role":"Student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Get current user (replace <token> with actual JWT)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"

# Upload file
curl -X POST http://localhost:5000/api/resources \
  -H "Authorization: Bearer <token>" \
  -F "file=@path/to/file.pdf"
```

## 🔒 Security Best Practices

- **Environment Variables**: Keep secrets out of version control; use `.gitignore` to exclude `.env`
- **JWT Secret**: Use a long, random string; rotate in production if compromised
- **Password Hashing**: Passwords are hashed with bcryptjs before storage
- **CORS**: Currently configured to allow all origins; restrict in production
- **Input Validation**: Always validate and sanitize user input before processing

## ⚠️ Troubleshooting

### MongoDB Connection Failed

```
❌ MongoDB connection failed
Error: ECONNREFUSED
```

**Solution**: Ensure MONGODB_URI is correct and MongoDB Atlas firewall allows your IP.

### JWT Token Invalid

```
Error: Token invalid or expired
```

**Solution**: Re-login to get a fresh token.

### File Upload Failed (ENOENT)

```
Error: ENOENT: no such file or directory
```

**Solution**: Ensure `uploads/` directory exists. For cloud hosting, migrate to S3.

### CORS Errors

**Solution**: Ensure `cors()` middleware is enabled and frontend headers are correct.

## 🤝 Contributing

- Fork the repo and create a feature branch
- Make changes and test thoroughly
- Submit a pull request with a clear description

## 📄 License

MIT License

## 📞 Support

For issues or questions, open an issue on [GitHub](https://github.com/sanjana71006/NotezillaApp/issues).

---

**Last Updated**: November 2025  
**Repository**: [sanjana71006/NotezillaApp](https://github.com/sanjana71006/NotezillaApp)
