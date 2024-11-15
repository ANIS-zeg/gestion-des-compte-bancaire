const express = require('express');
const sequelize = require('./config/database');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const loginHistoryRoutes = require('./routes/loginHistoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoute = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const notificationRoutes = require('./routes/notificationRoutes')
const authMiddleware = require('./middleware/authMiddleware');



require('./models/BankAccount')
require('./models/LoginHistory')
require('./models/Notification')
require('./models/Transaction')
require('./models/User')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/login-history', loginHistoryRoutes);
app.use('/api/user', userRoute);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', authMiddleware, userRoute);





sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(error => {
    console.error('Error during database synchronization:', error);
  });

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
