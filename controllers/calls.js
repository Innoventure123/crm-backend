const { Op } = require("sequelize");
const Calls = require("../models/calls");
const Users = require("../models/users");
const Project = require("../models/projects");
const Product = require("../models/products");

exports.addCall = async (req, res) => {
	try {
		const data = req.body;

		if (data.next_follow_up == "yes") {
			data.status = "Follow-up";
		}
		const newCall = await Calls.create({
			...data,
			assign_by: req.user.id,
			added_by: req.user.id,
			converted_by: req.user.id,
			created_at: new Date(),
			updated_at: new Date(),
		});

		return res
			.status(201)
			.json({ success: true, message: "Call created", data: newCall });
	} catch (err) {
		console.error("Add Call Error:", err);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
};

exports.updateCall = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "Call ID is required" });
		}

		const value = req.body;

		const call = await Calls.findByPk(id);

		if (!call) {
			return res
				.status(404)
				.json({ success: false, message: "Call not found" });
		}

		// Update the call
		await Calls.update(
			{ ...value, updated_at: new Date() },
			{ where: { id: id } }
		);

		return res.status(200).json({
			success: true,
			message: "Call updated successfully",
			data: call,
		});
	} catch (err) {
		console.error("Update Call Error:", err);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error" });
	}
};

exports.getAllCallListing = async (req, res) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const user_id = req.user.id;

		const findMyProfile = await Users.findByPk(user_id);

		if (!findMyProfile) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}

		const params = {};

		if (findMyProfile.role == "team_lead") {
			const findMyAgents = await Users.findAll({
				where: { manager_id: user_id },
			});
			const agentIds = findMyAgents.map((agent) => agent.id);
			params.agent_id = { [Op.in]: agentIds };
		} else if (findMyProfile.role == "agent") {
			params.agent_id = user_id;
		} else if (findMyProfile.role == "sales_coordinator") {
			params.status = "Interested";
		}

		const { count, rows } = await Calls.findAndCountAll({
			where: params,
			limit,
			offset,
			order: [["id", "DESC"]],
			include: [
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "agent",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "creator",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "editor",
				},
				{
					model: Project,
					as: "project_details",
				},
				{
					model: Product,
					as: "product_details",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "converter",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "assigner",
				},
			],
		});

		return res.status(200).json({
			success: true,
			message: "Calls fetched",
			data: rows,
			meta: {
				totalItems: count,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching Call:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

exports.getCallById = async (req, res) => {
	const CallId = req.params.id;

	try {
		const Country = await Calls.findByPk(CallId, {
			include: [
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "agent",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "creator",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "editor",
				},
				{
					model: Project,
					as: "project_details",
				},
				{
					model: Product,
					as: "product_details",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "converter",
				},
				{
					model: Users,
					// attributes: ["id", "name", "email"],
					as: "assigner",
				},
			],
		});

		if (!Country) {
			return res.status(404).json({
				success: false,
				message: "Call Details not found",
			});
		}
		return res
			.status(200)
			.json({ success: true, message: "Call fetched", data: Country });
	} catch (error) {
		console.error("Error fetching Call:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

exports.updateStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		// Validate status value
		const allowedStatuses = [
			"Interested",
			"Follow-up",
			"Call Back",
			"Switched Off",
			"Not Reachable",
			"Not Interested",
			"Approved",
			"Under Process",
			"Rejected",
		];

		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: "Invalid status value.",
			});
		}

		// Find and update the record
		const call = await Calls.findByPk(id);
		if (!call) {
			return res.status(404).json({
				success: false,
				message: "Call not found.",
			});
		}

		call.status = status;
		await call.save();

		return res.status(200).json({
			success: true,
			message: "Status updated successfully.",
			data: call,
		});
	} catch (error) {
		console.error("Error updating status:", error);
		return res.status(500).json({
			success: false,
			message: "Server error.",
		});
	}
};

exports.deleteCall = async (req, res) => {
	try {
		const { id } = req.params;

		const call = await Calls.findByPk(id);

		if (!call) {
			return res.status(404).json({
				success: false,
				message: "Call not found.",
			});
		}

		await call.destroy();

		return res.status(200).json({
			success: true,
			message: "Call deleted successfully.",
		});
	} catch (error) {
		console.error("Error deleting call:", error);
		return res.status(500).json({
			success: false,
			message: "Server error.",
		});
	}
};

exports.getCreditQueues = async (req, res) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const user_id = req.user.id;

		const findMyProfile = await Users.findByPk(user_id);

		if (!findMyProfile) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}

		const params = { status: "Interested" };

		if (findMyProfile.role == "team_lead") {
			const findMyAgents = await Users.findAll({
				where: { manager_id: user_id },
			});
			const agentIds = findMyAgents.map((agent) => agent.id);
			params.agent_id = { [Op.in]: agentIds };
		} else if (findMyProfile.role == "agent") {
			params.agent_id = user_id;
		}

		const { count, rows } = await Calls.findAndCountAll({
			where: params,
			limit,
			offset,
			order: [["id", "DESC"]],
			include: [
				{
					model: Users,
					as: "agent",
				},
				{
					model: Users,
					as: "creator",
				},
				{
					model: Users,
					as: "editor",
				},
				{
					model: Project,
					as: "project_details",
				},
				{
					model: Product,
					as: "product_details",
				},
				{
					model: Users,
					as: "converter",
				},
				{
					model: Users,
					as: "assigner",
				},
			],
		});

		return res.status(200).json({
			success: true,
			message: "Credit Queue fetched",
			data: rows,
			meta: {
				totalItems: count,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching Credit:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
