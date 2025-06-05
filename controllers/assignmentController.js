const Assignment = require("../models/Assignment");
const User = require("../models/User");

exports.assignEngineer = async (req, res) => {
  try {
    const { engineers, project, weeklyHours, startDate, endDate } = req.body;

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
  const { engineerId, weeklyHours } = req.body;
  const { assignmentId } = req.params;

  try {
    const engineer = await User.findById(engineerId);
    const allAssignments = await Assignment.find({
      engineers: engineerId,
    });

    const today = new Date();
    const activeAssignments = allAssignments.filter(
      (a) => new Date(a.startDate) <= today && new Date(a.endDate) >= today
    );

    const currentLoad = activeAssignments.reduce(
      (sum, a) => sum + (a.weeklyHours || 0),
      0
    );

    if (currentLoad + weeklyHours > engineer.totalCapacity) {
      return res
        .status(400)
        .json({ msg: "Engineer exceeds capacity with this assignment." });
    }

    // Otherwise, update the assignment
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { $addToSet: { engineers: engineerId } }, // prevent duplicates
      { new: true }
    );

    res.json(assignment);
  } catch (err) {
    console.error("Add Engineer Error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};
