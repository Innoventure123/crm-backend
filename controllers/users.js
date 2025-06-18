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
			include: [
				{
					model: UserPermission,
					attributes: ["id", "permission_id"],
					include: [
						{
							model: Permission,
							attributes: [
								"id",
								"name",
								"display_name",
								"allowed_permissions",
								"added_type",
							],
						},
					],
				},
			],
			attributes: [
				"id",
				"password",
				"email",
				"mobile",
				"name",
				"gender",
				"status",
				"role",
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
