const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');
const Survey = require('../models/Survey');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');

router.post('/:id', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId).select('username');
    const username = user?.username || 'Anonymous';

    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    for (let i = 0; i < survey.segments.length; i++) {
      const segment = survey.segments[i];
      const answer = answers[i];

      if (segment.required) {
        const isEmpty =
          answer === undefined ||
          answer === '' ||
          (segment.type === 'checkboxes' && Array.isArray(answer) && answer.length === 0) ||
          (segment.type === 'rating-feedback' && (!answer || typeof answer.rating !== 'number'));

        if (isEmpty) {
          return res.status(400).json({
            message: `Answer required for segment "${segment.title}"`,
          });
        }
      }
    }

    const formattedAnswers = Object.entries(answers).map(([index, response]) => ({
      segmentIndex: parseInt(index, 10),
      response,
    }));

    const responseDoc = new SurveyResponse({
      surveyId: req.params.id,
      answers: formattedAnswers,
      userId,
      username,
    });

    await responseDoc.save();
    res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    console.error('Error submitting response:', err);
    res.status(500).json({ message: 'Failed to submit response' });
  }
});

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
