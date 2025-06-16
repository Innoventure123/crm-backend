const Products = require("../models/products");

exports.getAllProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const { count, rows } = await Products.findAndCountAll({
			limit,
			offset,
			order: [["created_at", "DESC"]], // Optional: change as needed
		});

		return res.status(200).json({
			success: true,
			message: "Products fetched",
			data: rows,
			meta: {
				totalItems: count,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching Products:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};

exports.getProductById = async (req, res) => {
	const ProductsId = req.params.id;

	try {
		const Product = await Products.findByPk(ProductsId);
		if (!Product) {
			return res.status(404).json({
				success: false,
				message: "Products not found",
			});
		}
		return res
			.status(200)
			.json({ success: true, message: "Products fetched", data: Product });
	} catch (error) {
		console.error("Error fetching Products:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
