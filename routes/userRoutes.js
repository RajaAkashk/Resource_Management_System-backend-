const express = require("express");
const router = express.Router();
const { allUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, allUser);

module.exports = router;
