const Project = require("../models/Project");
const Assignment = require("../models/Assignment");

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    await Assignment.deleteMany({ project: req.params.id });

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error deleting projects" });
  }
};
