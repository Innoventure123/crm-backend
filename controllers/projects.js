const Project = require("../models/projects");

exports.getAllProjects = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const { count, rows } = await Project.findAndCountAll({
			limit,
			offset,
			order: [["created_at", "DESC"]], // Optional: sort by creation time
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
