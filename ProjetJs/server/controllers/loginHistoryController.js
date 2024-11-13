const LoginHistory = require('../models/LoginHistory');

exports.getUserLoginHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Assure-toi que req.user est défini via un middleware d'authentification

    const history = await LoginHistory.findAll({
      where: { user_id: userId },
      order: [['login_date', 'DESC']]
    });

    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching login history', error });
  }
};
