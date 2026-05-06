const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/sync', async (req, res) => {
  try {
    const { name, email, imageUrl } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        imageUrl,
        subscription: 'free'
      });
      await user.save();
    } else {
      // Update existing user details if they changed
      user.name = name;
      user.imageUrl = imageUrl;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
