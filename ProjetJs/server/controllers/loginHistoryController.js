const LoginHistory = require('../models/LoginHistory');
const Notification = require('../models/Notification');

exports.getUserLoginHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentIp = req.ip;

    const lastLogin = await LoginHistory.findOne({
      where: { user_id: userId },
      order: [['login_date', 'DESC']]
    });

    if (lastLogin && lastLogin.ip_address !== currentIp) {
      await Notification.create({
        type: 'suspicious_login',
        message: `Connexion suspecte détectée depuis l'adresse IP ${currentIp}.`,
        user_id: userId
      });
    }

    await LoginHistory.create({
      user_id: userId,
      ip_address: currentIp,
      login_date: new Date()
    });

    const history = await LoginHistory.findAll({
      where: { user_id: userId },
      order: [['login_date', 'DESC']]
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Error fetching login history', error });
  }
};
