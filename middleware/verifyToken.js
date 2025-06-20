const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
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
		req.user = decoded;
		next();
	} catch (err) {
		return res
			.status(403)
			.json({ success: false, message: "Invalid or expired token." });
	}
};

module.exports = verifyToken;
