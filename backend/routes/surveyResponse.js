const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');

// Submit a response
router.post('/:id', async (req, res) => {
  try {
    const { answers } = req.body;

    // Convert answers object to array format expected by the schema
    const formattedAnswers = Object.entries(answers).map(([index, response]) => ({
      segmentIndex: parseInt(index, 10),
      response,
    }));

    const response = new SurveyResponse({
      surveyId: req.params.id,
      answers: formattedAnswers,
    });

    await response.save();
    res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    console.error('Error submitting response:', err.message);
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

// Get all responses for a specific survey
router.get('/:id', async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ surveyId: req.params.id });

    const formatted = responses.map((r) => {
      const result = {};
      r.answers.forEach((ans) => {
        result[ans.segmentIndex] = ans.response;
      });
      return result;
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching survey responses:', err.message);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

module.exports = router;
