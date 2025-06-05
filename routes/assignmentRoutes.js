const express = require("express");
const router = express.Router();
const {
  assignEngineer,
  getAssignments,
  deleteAssignment,
  addEngineerToAssignment,
} = require("../controllers/assignmentController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.post("/", authenticate, authorize(["Manager"]), assignEngineer);
router.get("/", authenticate, getAssignments);
router.delete("/delete/:id", authenticate, authorize(["Manager"]), deleteAssignment);
router.put("/:assignmentId/add-engineers", authenticate, authorize(["Manager"]), addEngineerToAssignment);


module.exports = router;
