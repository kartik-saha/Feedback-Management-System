const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const User = require('../models/User');
const auth = require('../middleware/auth');

const {
  getMySurveys,
  getSurveyResponses,
} = require('../controller/surveyController');

// ✅ Test route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Survey routes working' });
});

// ✅ Authenticated routes
router.get('/mine', auth, getMySurveys);

// ✅ Public routes
router.get('/:id/responses', getSurveyResponses);

// ✅ Create a new survey
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
      createdBy: user._id.toString(),
    });

    const savedSurvey = await newSurvey.save();
    res.status(201).json({ surveyId: savedSurvey._id });
  } catch (err) {
    console.error('Error saving survey:', err.message);
    res.status(500).json({ message: 'Failed to save survey' });
  }
});

// ✅ Submit a response to a survey
router.post('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers are required in object form' });
    }

    const survey = await Survey.findById(id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    survey.responses.push(answers);
    await survey.save();

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error('Error submitting survey response:', err.message);
    res.status(500).json({ message: 'Failed to submit survey response' });
  }
});

// ✅ Get a single survey by ID (keep this LAST)
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
