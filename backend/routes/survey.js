const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const User = require('../models/User');
const auth = require('../middleware/auth');
const {
  getMySurveys,
  getSurveyResponses,
} = require('../controller/surveyController');

router.get('/test', (req, res) => {
  res.json({ message: '✅ Survey routes working' });
});

router.get('/mine', auth, getMySurveys);

router.get('/:id/responses', getSurveyResponses);

router.post('/', auth, async (req, res) => {
  try {
    const { name, segments } = req.body;
    if (!name || !Array.isArray(segments)) {
      return res.status(400).json({ message: 'Name and segments are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cleanedSegments = segments.map(({ id, type, title, description, options, required }) => ({
      type,
      title,
      description,
      options,
      required: !!required
    }));

    console.log('Backend cleaned segments:', cleanedSegments);

    const newSurvey = new Survey({
      name,
      segments: cleanedSegments,
      createdBy: user._id.toString(),
    });

    const savedSurvey = await newSurvey.save();
    res.status(201).json({ surveyId: savedSurvey._id });
  } catch (err) {
    console.error('Error saving survey:', err.message);
    res.status(500).json({ message: 'Failed to save survey' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    await survey.deleteOne();
    res.status(200).json({ message: 'Survey deleted successfully' });
  } catch (err) {
    console.error('Error deleting survey:', err.message);
    res.status(500).json({ message: 'Failed to delete survey' });
  }
});

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
