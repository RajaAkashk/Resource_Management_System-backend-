const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.post("/", authenticate, authorize(["Manager"]), createProject);
router.get("/", authenticate, getProjects);
router.delete(
  "/delete/:id",
  authenticate,
  authorize(["Manager"]),
  deleteProject
);

module.exports = router;
