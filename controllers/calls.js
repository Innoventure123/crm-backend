const { Op, fn, col } = require("sequelize");
const Calls = require("../models/calls");
const Users = require("../models/users");
const Project = require("../models/projects");
const Product = require("../models/products");
const {
	rowsToStatMap,
	periodFilter,
	caseCount,
} = require("../utils/helperFunctions");

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

exports.getDashboard = async (req, res) => {
	try {
		const { start, end } = req.query;
		const user_id = req.user.id;

		const findMyProfile = await Users.findByPk(user_id);

		if (!findMyProfile) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}

		const role = findMyProfile.role;

		// Agent Dashboard
		if (role == "agent") {
			const where = { agent_id: user_id, ...periodFilter(start, end) };
			const totalCalls = await Calls.count({ where });

			const grouped = await Calls.findAll({
				attributes: ["status", [fn("COUNT", "*"), "count"]],
				where,
				group: ["status"],
			});

			const stats = rowsToStatMap(grouped);

			return res.status(200).json({
				success: true,
				message: "Data fetched",
				data: { totalCalls, ...stats },
			});
		}

		// Team Leader Dashboard
		if (role == "team_lead") {
			const agents = await Users.findAll({
				where: { manager_id: user_id, role: "agent" },
				attributes: ["id", "name"],
				raw: true,
			});

			const agentIds = agents.map((a) => a.id);
			if (!agentIds.length)
				return res.status(200).json({
					success: true,
					message: "Data fetched",
					data: { totalCalls: 0 },
				});

			const where = {
				agent_id: { [Op.in]: agentIds },
				...periodFilter(start, end),
			};
			const totalCalls = await Calls.count({ where });

			const grouped = await Calls.findAll({
				attributes: ["status", [fn("COUNT", "*"), "count"]],
				where,
				group: ["status"],
			});

			const stats = rowsToStatMap(grouped);

			// Table View
			const table = await Calls.findAll({
				attributes: [
					"agent_id",
					[fn("COUNT", "*"), "calls"],
					[caseCount("Interested"), "interested"],
					[caseCount("Under Process"), "underProcess"],
					[caseCount("Approved"), "approved"],
					[caseCount("Rejected"), "rejected"],
					[caseCount("Follow-up"), "followUp"],
					[caseCount("Not Interested"), "notInterested"],
				],
				where,
				group: ["agent_id"],
				raw: true,
			});

			const agentMap = Object.fromEntries(agents.map((a) => [a.id, a.name]));
			const formattedTable = table.map((row) => ({
				agentName: agentMap[row.agent_id],
				...row,
			}));

			return res.status(200).json({
				success: true,
				message: "Data fetched",
				data: { totalCalls, stats, table: formattedTable },
			});
		}

		// Sale Coordinator Dashboard
		if (role == "sales_coordinator") {
			const whereCommon = periodFilter(start, end);

			const [interested, underProcess, rejected] = await Promise.all(
				["Interested", "Under Process", "Rejected"].map((status) =>
					Calls.findAll({
						where: { status, ...whereCommon },
						include: [{ model: Users, as: "agent", attributes: ["name"] }],
						order: [["created_at", "DESC"]],
					})
				)
			);

			return res.status(200).json({
				success: true,
				message: "Data fetched",
				data: { interested, underProcess, rejected },
			});
		}

		// Unit Head Dashboard
		if (role == "unit_head") {
			const tlWhere = { role: "owner" };

			const tls = await Users.findAll({
				where: tlWhere,
				attributes: ["id"],
				raw: true,
			});
			const tlIds = tls.map((u) => u.id);

			const agents = await Users.findAll({
				where: { manager_id: { [Op.in]: tlIds }, role: "agent" },
				attributes: ["id", "manager_id"],
				raw: true,
			});

			const agentIds = agents.map((a) => a.id);
			const where = {
				agent_id: { [Op.in]: agentIds },
				...periodFilter(start, end),
			};

			const tlRows = await Calls.findAll({
				attributes: [
					[col("agent.manager_id"), "teamLeaderId"],
					[caseCount("Under Process"), "underProcess"],
					[caseCount("Approved"), "approved"],
					[caseCount("Rejected"), "rejected"],
				],
				include: [{ model: Users, as: "agent", attributes: [] }],
				where,
				group: ["agent.manager_id"],
				raw: true,
			});

			const agentRows = await Calls.findAll({
				attributes: [
					"agent_id",
					[caseCount("Under Process"), "underProcess"],
					[caseCount("Approved"), "approved"],
					[caseCount("Rejected"), "rejected"],
				],
				where,
				group: ["agent_id"],
				raw: true,
			});

			return res.status(200).json({
				success: true,
				message: "Data fetched",
				data: { teamLeaderStats: tlRows, agentStats: agentRows },
			});
		}

		// Owner Dashboard
		if (role == "owner") {
			const where = { ...periodFilter(start, end) };

			const [totalAgents, totalTL, totalCalls, grouped] = await Promise.all([
				Users.count({ where: { role: "agent" } }),
				Users.count({ where: { role: "team_lead" } }),
				Calls.count({ where }),
				Calls.findAll({
					attributes: ["status", [fn("COUNT", "*"), "count"]],
					where,
					group: ["status"],
				}),
			]);

			const stats = rowsToStatMap(grouped);

			const conversionRate = (
				(stats.Approved / (stats.Interested || 1)) *
				100
			).toFixed(2);

			return res.status(200).json({
				success: true,
				message: "Data fetched",
				data: {
					global: {
						totalAgents,
						totalTeamLeaders: totalTL,
						totalCalls,
						conversionRate,
					},
					stats,
				},
			});
		}

		return res.status(403).json({ message: "Unauthorized role" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", error });
	}
};
