const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');

// Submit a response
router.post('/:id', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId).select('username');
    const username = user?.username || 'Anonymous';

    const formattedAnswers = Object.entries(answers).map(([index, response]) => ({
      segmentIndex: parseInt(index, 10),
      response,
    }));

    const response = new SurveyResponse({
      surveyId: req.params.id,
      answers: formattedAnswers,
      userId,
      username,
    });

    await response.save();
    res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    console.error('Error submitting response:', err); // Log full error
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

// Get all responses for a specific survey
router.get('/:id', async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ surveyId: req.params.id });

    const formatted = responses.map((r) => {
      const result = {
        username: r.username || 'Anonymous',
        answers: {},
      };
      r.answers.forEach((ans) => {
        result.answers[ans.segmentIndex] = ans.response;
      });
      return result;
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching survey responses:', err);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

module.exports = router;
