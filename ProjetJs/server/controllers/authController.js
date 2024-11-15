const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');
const Notification = require("../models/Notification");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, ipAddress } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const currentIpAddress = ipAddress || "unknown";

    // Check the last login history for suspicious IP address
    const lastLogin = await LoginHistory.findOne({
      where: { user_id: user.id },
      order: [['login_date', 'DESC']]
    });

    // If the IP address is different, log a suspicious login notification
    if (lastLogin && lastLogin.ip_address !== currentIpAddress) {
      await Notification.create({
        type: 'suspicious_login',
        message: `Connexion suspecte détectée depuis une adresse IP différente : ${currentIpAddress}. Veuillez vérifier votre historique de connexion.`,
        user_id: user.id
      });
    }

    // Add login history to the database
    await LoginHistory.create({
      user_id: user.id,
      ip_address: currentIpAddress,
      login_date: new Date()
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


