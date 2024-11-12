const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérification des données
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
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



// Connexion de l'utilisateur avec enregistrement de l'historique
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token using the secret key from environment variables
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Capture IP address and User Agent for login history
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Save login history
    await LoginHistory.create({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent,
      loginDate: new Date()
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};


// Déconnexion de l'utilisateur (dépend de l'implémentation côté client pour invalider le token)
// exports.logout = (req, res) => {
//   res.status(200).json({ message: 'Logout successful' });
// };

