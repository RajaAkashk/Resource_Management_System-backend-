const Assignment = require("../models/Assignment");
const User = require("../models/User");

exports.assignEngineer = async (req, res) => {
  try {
    const { engineers, project, weeklyHours, startDate, endDate } = req.body;

    // Check that engineers array is not empty
    if (!Array.isArray(engineers) || engineers.length === 0) {
      return res.status(400).json({ msg: "Engineers list is required" });
    }

    // Loop through each engineer to perform capacity check
    for (const engineerId of engineers) {
      const engineerData = await User.findById(engineerId);
      if (!engineerData) {
        return res
          .status(404)
          .json({ msg: `Engineer not found: ${engineerId}` });
      }

      const existingAssignments = await Assignment.find({
        engineers: engineerId,
      });
      const totalAssigned = existingAssignments.reduce(
        (sum, a) => sum + a.weeklyHours,
        0
      );

      if (totalAssigned + weeklyHours > engineerData.totalCapacity) {
        return res.status(400).json({
          msg: `Engineer ${engineerData.name}'s capacity exceeded`,
        });
      }
    }

    const assignment = new Assignment({
      engineers,
      project,
      weeklyHours,
      startDate,
      endDate,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating assignment" });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("engineers")
      .populate("project");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching assignments", error });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    res.status(200).json({ msg: "Assignment deleted", assignment });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting assignment" });
  }
};

exports.addEngineerToAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { engineerId } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    // Checking for duplicates
    if (assignment.engineers.includes(engineerId)) {
      return res.status(400).json({ msg: "Engineer already assigned" });
    }

    assignment.engineers.push(engineerId);
    await assignment.save();

    res.status(200).json({ msg: "Engineer added", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error adding engineer", error: error.message });
  }
};
