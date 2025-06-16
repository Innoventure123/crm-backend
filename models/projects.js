const sequelize = require("../utils/db");
const { DataTypes } = require("sequelize");

const Project = sequelize.define(
	"Project",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		company_id: { type: DataTypes.INTEGER.UNSIGNED },
		project_name: { type: DataTypes.STRING, allowNull: false },
		project_short_code: DataTypes.STRING,
		project_summary: DataTypes.TEXT("long"),
		project_admin: DataTypes.INTEGER.UNSIGNED,
		start_date: { type: DataTypes.DATEONLY, allowNull: false },
		deadline: DataTypes.DATEONLY,
		notes: DataTypes.TEXT("long"),
		category_id: DataTypes.INTEGER.UNSIGNED,
		client_id: DataTypes.INTEGER.UNSIGNED,
		team_id: DataTypes.INTEGER.UNSIGNED,
		feedback: DataTypes.TEXT("medium"),
		manual_timelog: {
			type: DataTypes.ENUM("enable", "disable"),
			allowNull: false,
			defaultValue: "disable",
		},
		client_view_task: {
			type: DataTypes.ENUM("enable", "disable"),
			allowNull: false,
			defaultValue: "disable",
		},
		allow_client_notification: {
			type: DataTypes.ENUM("enable", "disable"),
			allowNull: false,
			defaultValue: "disable",
		},
		completion_percent: { type: DataTypes.TINYINT, allowNull: false },
		calculate_task_progress: {
			type: DataTypes.ENUM("true", "false"),
			allowNull: false,
			defaultValue: "true",
		},
		project_budget: DataTypes.DOUBLE(20, 2),
		currency_id: DataTypes.INTEGER.UNSIGNED,
		hours_allocated: DataTypes.DOUBLE(8, 2),
		status: { type: DataTypes.STRING, defaultValue: "in progress" },
		added_by: DataTypes.INTEGER.UNSIGNED,
		last_updated_by: DataTypes.INTEGER.UNSIGNED,
		hash: DataTypes.TEXT,
		public: { type: DataTypes.TINYINT, allowNull: false },
		enable_miroboard: { type: DataTypes.TINYINT, defaultValue: 0 },
		miro_board_id: DataTypes.STRING,
		client_access: { type: DataTypes.TINYINT, defaultValue: 0 },
	},
	{
		tableName: "projects",
		paranoid: true,
		timestamps: true,
		underscored: true,
	}
);

Project.associate = (models) => {
	Project.belongsTo(models.User, { as: "addedBy", foreignKey: "added_by" });
	Project.belongsTo(models.User, {
		as: "lastUpdatedBy",
		foreignKey: "last_updated_by",
	});
	Project.belongsTo(models.User, { as: "client", foreignKey: "client_id" });
	Project.belongsTo(models.User, { as: "admin", foreignKey: "project_admin" });
	// Project.belongsTo(models.Team, { foreignKey: "team_id" });
	// Project.belongsTo(models.Company, { foreignKey: "company_id" });
	// Project.belongsTo(models.Currency, { foreignKey: "currency_id" });
	// Project.belongsTo(models.ProjectCategory, { foreignKey: "category_id" });
};

module.exports = Project;
