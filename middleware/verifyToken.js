const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const verifyToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ success: false, message: "Access denied. No token provided." });
	}

	const token = authHeader.split(" ")[1];

	try {
		const secretKey = process.env.JWT_SECRET;
		const decoded = jwt.verify(token, secretKey);
		// Ensure the user still exists and is allowed to access the system.
		const dbUser = await Users.findByPk(decoded.id, {
			attributes: ["id", "email", "role", "role_id", "status", "login"],
		});
		if (!dbUser) {
			return res
				.status(401)
				.json({ success: false, message: "Access denied. User not found." });
		}

		if (dbUser.status === "deactive" || dbUser.login === "disable") {
			return res.status(403).json({
				success: false,
				message: "Access denied. User is deactivated.",
			});
		}

		req.user = {
			...decoded,
			role: dbUser.role,
			role_id: dbUser.role_id,
			status: dbUser.status,
			login: dbUser.login,
		};
		next();
	} catch (err) {
		return res
			.status(403)
			.json({ success: false, message: "Invalid or expired token." });
	}
};

module.exports = verifyToken;
