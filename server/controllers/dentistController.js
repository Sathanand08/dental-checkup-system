const User = require('../models/User');

exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await User.find({ role: 'dentist' })
      .select('-password');
    res.json(dentists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};