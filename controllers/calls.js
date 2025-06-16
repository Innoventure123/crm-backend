const Calls = require("../models/calls");

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

exports.getAllCallListing = async (req, res) => {
	try {
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const { count, rows } = await Calls.findAndCountAll({
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
