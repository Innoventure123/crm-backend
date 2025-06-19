const { Op } = require("sequelize");
const Calls = require("../models/calls");
const Users = require("../models/users");

exports.addCall = async (req, res) => {
	try {
		const data = req.body;

		const newCall = await Calls.create({
			...data,
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
		await call.update({
			...value,
			updated_at: new Date(),
		});

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
		}

		const { count, rows } = await Calls.findAndCountAll({
			where: params,
			limit,
			offset,
			order: [["created_at", "DESC"]],
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
		const Country = await Calls.findByPk(CallId);
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
