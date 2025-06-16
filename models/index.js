const Product = require("./products");

const models = {
	User: require("./users"),
	UserPermission: require("./user_permission"),
	// Company: require("./company"),
	// Country: require("./country"),
	Permission: require("./permission"),
	PermissionType: require("./permission_type"),
	Project: require("./projects"),
	Product: require("./products"),
	Country: require("./country"),
};

// Set up associations
Object.values(models).forEach((model) => {
	if (model.associate) {
		model.associate(models);
	}
});
