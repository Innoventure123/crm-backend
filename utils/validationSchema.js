const Joi = require("joi");

exports.schema = {
	createCallSchema: Joi.object({
		client_id: Joi.number().optional(),
		// column_priority: Joi.number().optional().default(0),
		agent_id: Joi.number().optional(),
		company_name: Joi.string().max(191).optional(),
		salutation: Joi.string()
			.valid("mr", "mrs", "miss", "dr", "sir", "madam")
			.optional(),
		client_name: Joi.string().max(191).optional(),
		client_email: Joi.string().email().optional(),
		mobile: Joi.string().max(191).optional(),
		cell: Joi.string().max(191).optional(),
		country: Joi.string().max(191).optional(),
		note: Joi.string().optional(),
		next_follow_up: Joi.string().valid("yes", "no").default("yes"),
		value: Joi.number().optional().default(0),
		// added_by: Joi.number().optional(),
		// last_updated_by: Joi.number().optional(),
		// hash: Joi.string().optional(),
		product_id: Joi.number().optional(),
		lead_id: Joi.string().valid("Pending", "Converted").default("Pending"),
		// converted_by: Joi.string().optional(),
		company_id: Joi.number().optional().default(1),
		assign_by: Joi.number().optional(),
		last_assign_date: Joi.date().optional(),
		project_id: Joi.number().optional(),
		salary: Joi.number().max(6).optional(),
	}),

	updateCallSchema: Joi.object({
		client_id: Joi.number().integer().optional(),
		column_priority: Joi.number().integer().optional(),
		agent_id: Joi.number().integer().optional(),
		company_name: Joi.string().max(191).optional(),
		salutation: Joi.string()
			.valid("mr", "mrs", "miss", "dr", "sir", "madam")
			.optional(),
		client_name: Joi.string().max(191).optional(),
		client_email: Joi.string().email().optional(),
		mobile: Joi.string().max(191).optional(),
		cell: Joi.string().max(191).optional(),
		country: Joi.string().max(191).optional(),
		note: Joi.string().optional(),
		next_follow_up: Joi.string().valid("yes", "no").default("yes"),
		value: Joi.number().optional().default(0),
		added_by: Joi.number().integer().optional(),
		last_updated_by: Joi.number().integer().optional(),
		hash: Joi.string().optional(),
		product_id: Joi.number().integer().optional(),
		lead_id: Joi.string().valid("Pending", "Converted").default("Pending"),
		converted_by: Joi.string().max(10).optional(),
		company_id: Joi.number().integer().optional().default(1),
		assign_by: Joi.number().integer().optional(),
		last_assign_date: Joi.date().optional(),
		project_id: Joi.number().integer().optional(),
		salary: Joi.number().max(6).optional(),
	}),

	createUserSchema: Joi.object({
		name: Joi.string().max(191).required(),
		email: Joi.string().email().max(191).allow(null, "").optional(),
		password: Joi.string().min(6).max(191).required(),
		mobile: Joi.string().max(191).allow(null, "").optional(),
		gender: Joi.string().valid("male", "female", "others").allow(null).optional(),
		role: Joi.string()
			.valid(
				"owner",
				"unit_head",
				"sales_coordinator",
				"team_lead",
				"agent",
				"process_head"
			)
			.optional(),
		role_id: Joi.number().integer().min(1).max(255).optional(),
		manager_id: Joi.number().integer().allow(null).optional(),
		status: Joi.string().valid("active", "deactive").optional(),
		login: Joi.string().valid("enable", "disable").optional(),
		mac_id: Joi.string().min(1).required(),
		mac_login: Joi.string().valid("enable", "disable").optional(),
	}),

	updateUserSchema: Joi.object({
		name: Joi.string().max(191).optional(),
		email: Joi.string().email().max(191).allow(null, "").optional(),
		password: Joi.string().min(6).max(191).optional(),
		mobile: Joi.string().max(191).allow(null, "").optional(),
		gender: Joi.string().valid("male", "female", "others").allow(null).optional(),
		role: Joi.string()
			.valid(
				"owner",
				"unit_head",
				"sales_coordinator",
				"team_lead",
				"agent",
				"process_head"
			)
			.optional(),
		role_id: Joi.number().integer().min(1).max(255).optional(),
		manager_id: Joi.number().integer().allow(null).optional(),
		status: Joi.string().valid("active", "deactive").optional(),
		login: Joi.string().valid("enable", "disable").optional(),
		mac_id: Joi.string().min(1).optional(),
		mac_login: Joi.string().valid("enable", "disable").optional(),
	}).min(1),

	updateUserStatusSchema: Joi.object({
		status: Joi.string().valid("active", "deactive").required(),
	}),
};
