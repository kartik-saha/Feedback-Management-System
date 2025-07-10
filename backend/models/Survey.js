const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
  type: String, // 'text', 'mcq', 'checkbox'
  title: String,
  description: String,
  options: [String],
});

const SurveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  segments: [SegmentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Survey', SurveySchema);
