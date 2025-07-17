const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  options: [String],
});

const SurveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    segments: [SegmentSchema],
    createdBy: { type: String, required: true }, // <-- Add this
  },
  { timestamps: true }
);

module.exports = mongoose.model('Survey', SurveySchema);
