exports.validateBody = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body);

		if (error) {
			const errorMessage = error.details
				.map((detail) => detail.message)
				.join(", ");

			const msg = errorMessage.replace(/"/g, "").replace(/[^a-zA-Z_ ]/g, " ");

			return res.status(400).json({
				success: false,
				message: msg,
			});
		}

		next();
	};
};
