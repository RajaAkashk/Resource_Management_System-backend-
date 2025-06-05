const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Manager", "Engineer"], required: true },
  skills: [String],
  totalCapacity: { type: Number, default: 40 },
});

module.exports = mongoose.model("TW_User", userSchema);
