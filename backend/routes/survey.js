const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');

// @route   POST /api/surveys
// @desc    Save a new survey
router.post('/', async (req, res) => {
  try {
    const { name, segments } = req.body;

    if (!name || !Array.isArray(segments)) {
      return res.status(400).json({ message: 'Name and segments are required' });
    }

    const newSurvey = new Survey({ name, segments });
    const savedSurvey = await newSurvey.save();

    return res.status(201).json({ surveyId: savedSurvey._id });
  } catch (err) {
    console.error('Error saving survey:', err.message);
    return res.status(500).json({ message: 'Failed to save survey' });
  }
});

// @route   GET /api/surveys/:id
// @desc    Fetch a survey by ID
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    return res.status(200).json(survey);
  } catch (err) {
    console.error('Error retrieving survey:', err.message);
    return res.status(500).json({ message: 'Error retrieving survey' });
  }
});

module.exports = router;
