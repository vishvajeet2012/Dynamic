require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT_NO || 3000; // Added fallback port
const Router = require('./routes/auth/auth');
const HomePageRouter = require('./routes/adminRoutes/HomePage'); // Added for HomePage routes
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const configureCors = require('./config/corsConfig');
const requestLogger = require('./middleware/logger');

///app.use(configureCors()); 
app.use(requestLogger)// Middleware to log requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' })); // Increased for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Database connection

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully ❤️💙');
  } catch (err) {
    console.error('Database connection err', err);
    process.exit(1); 
  }
};

// Routes
app.use('/api', Router);
app.use('/home', HomePageRouter); // Added for admin routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀`);
  });
};

startServer();