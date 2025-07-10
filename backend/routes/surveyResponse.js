const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse');

// Existing survey routes...

// Save survey response
router.post('/:id/responses', async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;

  try {
    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const newResponse = new SurveyResponse({
      surveyId: id,
      answers,
    });

    await newResponse.save();
    res.status(201).json({ message: 'Response saved successfully' });
  } catch (err) {
    console.error('Error saving response:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
