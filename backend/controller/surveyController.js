const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse');
const User = require('../models/User');

// ✅ Get all surveys created by the logged-in user
exports.getMySurveys = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.warn('User not found for ID:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Find surveys created by user ID only
    const surveys = await Survey.find({
      createdBy: user._id.toString()
    }).sort({ createdAt: -1 });

    console.log(`[getMySurveys] ${surveys.length} surveys found for user ${user.username}`);
    res.status(200).json(surveys);
  } catch (err) {
    console.error('[getMySurveys] Error:', err);
    res.status(500).json({ message: 'Failed to fetch surveys', error: err.message });
  }
};

// ✅ Get all responses for a specific survey
exports.getSurveyResponses = async (req, res) => {
  try {
    const surveyId = req.params.id;

    const responses = await SurveyResponse.find({ surveyId });

    // 🔄 Convert array of answer objects into flat segmentIndex: response map
    const formatted = responses.map((r) => {
      const result = {};
      r.answers.forEach((ans) => {
        result[ans.segmentIndex] = ans.response;
      });
      return result;
    });

    console.log(`[getSurveyResponses] ${formatted.length} responses found for survey ${surveyId}`);
    res.status(200).json(formatted);
  } catch (err) {
    console.error('[getSurveyResponses] Error:', err);
    res.status(500).json({ message: 'Failed to fetch responses', error: err.message });
  }
};
