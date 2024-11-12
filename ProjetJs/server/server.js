const express = require('express');
const sequelize = require('./config/database'); // Database configuration
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const loginHistoryRoutes = require('./routes/loginHistoryRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/login-history', loginHistoryRoutes);

// Database synchronization to create tables if they don’t exist
sequelize.sync({ force: false }) // Set to true only in development to recreate tables
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(error => {
    console.error('Error during database synchronization:', error);
  });

// Example route to check if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Online Banking Server!');
});

// Start the server on localhost
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
