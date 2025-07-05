const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Call = sequelize.define(
	"Call",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		client_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		// source_id: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// },
		// status_id: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// },
		column_priority: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
		agent_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		},
		company_name: {
			type: DataTypes.STRING(191),
			allowNull: true,
			// Charset utf8mb3 vs utf8mb4 is usually not specified in Sequelize model
		},
		// website: {
		// 	type: DataTypes.STRING(191),
		// 	allowNull: true,
		// },
		// address: {
		// 	type: DataTypes.TEXT,
		// 	allowNull: true,
		// },
		salutation: {
			type: DataTypes.ENUM("mr", "mrs", "miss", "dr", "sir", "madam"),
			allowNull: true,
		},
		client_name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		client_email: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		mobile: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		cell: {
			type: DataTypes.STRING(191),
			allowNull: true,
			defaultValue: "",
		},
		// office: {
		// 	type: DataTypes.STRING(191),
		// 	allowNull: true,
		// },
		// city: {
		// 	type: DataTypes.STRING(191),
		// 	allowNull: true,
		// },
		// state: {
		// 	type: DataTypes.STRING(191),
		// 	allowNull: true,
		// },
		country: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		// postal_code: {
		// 	type: DataTypes.STRING(191),
		// 	allowNull: true,
		// },
		note: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: "",
		},
		next_follow_up: {
			type: DataTypes.ENUM("yes", "no"),
			allowNull: false,
			defaultValue: "no",
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		value: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			defaultValue: 0,
		},
		// currency_id: {
		// 	type: DataTypes.INTEGER.UNSIGNED,
		// 	allowNull: true,
		// },
		// category_id: {
		// 	type: DataTypes.INTEGER.UNSIGNED,
		// 	allowNull: true,
		// },
		added_by: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		},
		salary: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		last_updated_by: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			defaultValue: null,
		},
		hash: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: null,
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		lead_id: {
			type: DataTypes.ENUM("Pending", "Converted"),
			allowNull: false,
			defaultValue: "Pending",
		},
		converted_by: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			defaultValue: null,
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 1,
		},
		assign_by: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		last_assign_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
		project_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(
				"Interested",
				"Follow-up",
				"Call Back",
				"Switched Off",
				"Not Reachable",
				"Not Interested",
				"Approved",
				"Under Process",
				"Rejected",
				"Pending"
			),
			allowNull: true,
			defaultValue: "Pending",
		},
	},
	{
		tableName: "call",
		timestamps: false,
		underscored: true,
	}
);

Call.associate = (models) => {
	Call.belongsTo(models.User, { foreignKey: "agent_id", as: "agent" });
	Call.belongsTo(models.User, { foreignKey: "added_by", as: "creator" });
	Call.belongsTo(models.User, { foreignKey: "last_updated_by", as: "editor" });
	Call.belongsTo(models.User, { foreignKey: "assign_by", as: "assigner" });
	Call.belongsTo(models.User, { foreignKey: "converted_by", as: "converter" });

	Call.belongsTo(models.Product, {
		foreignKey: "product_id",
		as: "product_details",
	});
	Call.belongsTo(models.Project, {
		foreignKey: "project_id",
		as: "project_details",
	});
};

module.exports = Call;
