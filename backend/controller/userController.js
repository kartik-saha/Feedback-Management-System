// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      password: user.password, // ⚠️ Only return if absolutely needed
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/user/update
exports.updateUser = async (req, res) => {
  try {
    const { newUsername, newEmail, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (newUsername) user.username = newUsername;
    if (newEmail) user.email = newEmail;
    if (newPassword) user.password = newPassword; // will be hashed in pre('save')

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};
