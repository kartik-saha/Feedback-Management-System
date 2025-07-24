const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'short-answer', 'rating-feedback'
  title: String,
  description: String,
  options: [String], // still used for multiple-choice or checkboxes
  required: { type: Boolean, default: false }, // ✅ New
});

const SurveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    segments: [SegmentSchema],
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Survey', SurveySchema);
