const Countries = require("../models/country");

exports.getAllCountries = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const { count, rows } = await Countries.findAndCountAll({
			limit,
			offset,
			order: [["name", "ASC"]], // Optional: order by country name
		});

		return res.status(200).json({
			success: true,
			message: "Countries fetched",
			data: rows,
			meta: {
				totalItems: count,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching Countries:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

exports.getCountryById = async (req, res) => {
	const CountryId = req.params.id;

	try {
		const Country = await Countries.findByPk(CountryId);
		if (!Country) {
			return res.status(404).json({
				success: false,
				message: "Country not found",
			});
		}
		return res
			.status(200)
			.json({ success: true, message: "Country fetched", data: Country });
	} catch (error) {
		console.error("Error fetching Country:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
