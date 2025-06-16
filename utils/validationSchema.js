const Joi = require("joi");

exports.schema = {
	createCallSchema: Joi.object({
		client_id: Joi.number().required(),
		// column_priority: Joi.number().optional().default(0),
		agent_id: Joi.number().required(),
		company_name: Joi.string().max(191).required(),
		salutation: Joi.string()
			.valid("mr", "mrs", "miss", "dr", "sir", "madam")
			.required(),
		client_name: Joi.string().max(191).required(),
		client_email: Joi.string().email().required(),
		mobile: Joi.string().max(191).required(),
		cell: Joi.string().max(191).optional(),
		country: Joi.string().max(191).required(),
		note: Joi.string().optional(),
		next_follow_up: Joi.string().valid("yes", "no").default("yes"),
		value: Joi.number().optional().default(0),
		// added_by: Joi.number().required(),
		// last_updated_by: Joi.number().required(),
		// hash: Joi.string().required(),
		product_id: Joi.number().required(),
		lead_id: Joi.string().valid("Pending", "Converted").default("Pending"),
		// converted_by: Joi.string().required(),
		company_id: Joi.number().required().default(1),
		assign_by: Joi.number().required(),
		last_assign_date: Joi.date().required(),
		project_id: Joi.number().required(),
	}),
};
