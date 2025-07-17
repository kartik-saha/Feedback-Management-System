const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Save a new survey
router.post('/', auth, async (req, res) => {
  try {
    const { name, segments } = req.body;
    if (!name || !Array.isArray(segments)) {
      return res.status(400).json({ message: 'Name and segments are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newSurvey = new Survey({
      name,
      segments,
      createdBy: user.username, // Store username
    });

    const savedSurvey = await newSurvey.save();
    res.status(201).json({ surveyId: savedSurvey._id });
  } catch (err) {
    console.error('Error saving survey:', err.message);
    res.status(500).json({ message: 'Failed to save survey' });
  }
});

// Fetch a survey by ID
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.status(200).json(survey);
  } catch (err) {
    console.error('Error retrieving survey:', err.message);
    res.status(500).json({ message: 'Error retrieving survey' });
  }
});

module.exports = router;
