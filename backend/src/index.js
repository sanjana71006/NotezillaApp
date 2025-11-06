const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares
// Enable CORS with credentials support so frontend (dev server) can send/receive cookies
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Start
const PORT = process.env.PORT || 5000;

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in environment. Please set it in .env');
    process.exit(1);
  }

  try {
    // Connect with mongoose
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    // Optional: listen for mongoose connection errors after initial connect
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Graceful shutdown
    const graceful = async () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('HTTP server closed');
      });
      try {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed');
        process.exit(0);
      } catch (closeErr) {
        console.error('Error during MongoDB disconnection', closeErr);
        process.exit(1);
      }
    };

    process.on('SIGINT', graceful);
    process.on('SIGTERM', graceful);

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();
