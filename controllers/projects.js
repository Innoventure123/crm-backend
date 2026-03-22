const Project = require("../models/projects");

const normalizeTinyInt = (value) => {
  if (value === true) return 1;
  if (value === false) return 0;
  return value;
};

exports.createProject = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.public !== undefined) {
      payload.public = normalizeTinyInt(payload.public);
    }

    const project = await Project.create({
      ...payload,
      added_by: req.user.id,
      last_updated_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const payload = { ...req.body };
    if (payload.public !== undefined) {
      payload.public = normalizeTinyInt(payload.public);
    }
    payload.last_updated_by = req.user.id;

    await project.update(payload);
    await project.reload();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.update({
      is_deleted: 1,
      deleted_at: new Date(),
      last_updated_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Project.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]], // Optional: sort by creation time
      where: {
        is_deleted: 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Projects fetched",
      data: rows,
      meta: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Project fetched", data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
