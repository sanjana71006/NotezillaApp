const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const authRoutes = require('../src/routes/auth');
const resourceRoutes = require('../src/routes/resources');
const adminRoutes = require('../src/routes/admin');
const assignmentRoutes = require('../src/routes/assignments');
const postRoutes = require('../src/routes/posts');
const discussionRoutes = require('../src/routes/discussions');
const studyGroupRoutes = require('../src/routes/studyGroups');
const notificationRoutes = require('../src/routes/notifications');
const progressRoutes = require('../src/routes/progress');
const reportRoutes = require('../src/routes/reports');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
// Ensure uploads directory exists for serverless environment
const uploadsDir = path.join(__dirname, '..', 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at', uploadsDir);
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Connect to database
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    await connectDB();
    isConnected = true;
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Vercel serverless function handler
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
