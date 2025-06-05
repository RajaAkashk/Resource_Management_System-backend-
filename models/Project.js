const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  requiredSkills: [String],
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['Planned', 'Ongoing', 'Completed'],
    default: 'Planned',
  },
});

module.exports = mongoose.model('TW_Project', projectSchema);
