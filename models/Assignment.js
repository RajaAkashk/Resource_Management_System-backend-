const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  engineers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TW_User",
      required: true,
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TW_Project",
    required: true,
  },
  weeklyHours: { type: Number, required: true },
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("TW_Assignment", assignmentSchema);
