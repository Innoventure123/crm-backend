const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserPermission = require("../models/user_permission");
const Permission = require("../models/permission");

exports.getAll = async (req, res) => {
	const users = await Users.findAll();
	console.log(users);
	res.json(users);
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	// Validation
	if (!email)
		return res
			.status(400)
			.json({ success: false, message: "Email is required" });
	if (!password)
		return res
			.status(400)
			.json({ success: false, message: "Password is required" });

	try {
		// Check user exists
		const user = await Users.findOne({
			where: { email },
			// include: [
			// 	{
			// 		model: UserPermission,
			// 		attributes: ["id", "permission_id"],
			// 		include: [
			// 			{
			// 				model: Permission,
			// 				attributes: [
			// 					"id",
			// 					"name",
			// 					"display_name",
			// 					"allowed_permissions",
			// 					"added_type",
			// 				],
			// 			},
			// 		],
			// 	},
			// ],
			attributes: [
				"id",
				"password",
				"email",
				"mobile",
				"name",
				"gender",
				"status",
				"role",
				"role_id",
				"manager_id",
			],
		});

		if (!user)
			return res
				.status(404)
				.json({ success: false, message: "User not found" });

		// Match password
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch)
			return res
				.status(401)
				.json({ success: false, message: "Invalid password" });

		// Generate JWT
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		const data = JSON.parse(JSON.stringify(user));
		delete data.password;

		return res.json({
			success: true,
			message: "Login successful",
			token,
			data: data,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: error.message,
		});
	}
};

exports.getAllAgentsListing = async (req, res) => {
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
			params.manager_id = user_id;
		} else if (findMyProfile.role == "agent") {
			params.id = user_id;
		}

		const { count, rows } = await Users.findAndCountAll({
			where: params,
			limit,
			offset,
			order: [["created_at", "DESC"]],
		});

		return res.status(200).json({
			success: true,
			message: "Agents fetched",
			data: rows,
			meta: {
				totalItems: count,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching agents:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
