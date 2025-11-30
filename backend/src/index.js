const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contacts');
const assignmentRoutes = require('./routes/assignments');
const discussionRoutes = require('./routes/discussions');
const notificationRoutes = require('./routes/notifications');
const studyGroupRoutes = require('./routes/studyGroups');
const progressRoutes = require('./routes/progress');
const postRoutes = require('./routes/posts');
const reportRoutes = require('./routes/reports');

const app = express();

// Middlewares
// Configure CORS to allow requests from frontend deployments
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'https://notezilla-app.vercel.app',
    'https://notezilla-frontend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
// Ensure uploads directory exists (multer doesn't create it automatically)
const uploadsDir = path.join(__dirname, '..', 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    server: 'Notezilla Backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB', err);
    process.exit(1);
  });


