const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGO_URI;

const intializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Successfully connected to Database."))
    .catch((error) => {
      console.log("Error connecting to database.", error);
    });
};

module.exports = { intializeDatabase };
