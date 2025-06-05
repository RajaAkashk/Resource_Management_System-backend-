const User = require("../models/User");

exports.allUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ msg: "user not found" });
  }
};
