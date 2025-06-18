const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const UserPermission = require("./user_permission");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		company_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		two_factor_secret: {
			type: DataTypes.TEXT,
		},
		two_factor_recovery_codes: {
			type: DataTypes.TEXT,
		},
		two_factor_confirmed: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 0,
		},
		two_factor_email_confirmed: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 0,
		},
		image: {
			type: DataTypes.STRING(191),
		},
		mobile: {
			type: DataTypes.STRING(191),
		},
		gender: {
			type: DataTypes.ENUM("male", "female", "others"),
		},
		salutation: {
			type: DataTypes.ENUM("mr", "mrs", "miss", "dr", "sir", "madam"),
		},
		locale: {
			type: DataTypes.STRING(191),
			allowNull: false,
			defaultValue: "en",
		},
		status: {
			type: DataTypes.ENUM("active", "deactive"),
			allowNull: false,
			defaultValue: "active",
		},
		login: {
			type: DataTypes.ENUM("enable", "disable"),
			allowNull: false,
			defaultValue: "enable",
		},
		onesignal_player_id: {
			type: DataTypes.TEXT,
		},
		last_login: {
			type: DataTypes.DATE,
		},
		email_notifications: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 1,
		},
		country_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		},
		dark_theme: {
			type: DataTypes.TINYINT,
			allowNull: false,
		},
		rtl: {
			type: DataTypes.TINYINT,
			allowNull: false,
		},
		two_fa_verify_via: {
			type: DataTypes.ENUM("email", "google_authenticator", "both"),
			allowNull: true,
		},
		two_factor_code: {
			type: DataTypes.STRING(191),
			comment: "when authenticator is email",
		},
		two_factor_expires_at: {
			type: DataTypes.DATE,
		},
		admin_approval: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 1,
		},
		permission_sync: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 1,
		},
		google_calendar_status: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 1,
		},
		remember_token: {
			type: DataTypes.STRING(100),
		},
		customised_permissions: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 0,
		},
		stripe_id: {
			type: DataTypes.STRING(191),
		},
		pm_type: {
			type: DataTypes.STRING(191),
		},
		pm_last_four: {
			type: DataTypes.STRING(4),
		},
		trial_ends_at: {
			type: DataTypes.DATE,
		},
		mac_id: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		mac_login: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: "disable",
		},
		created_at: {
			type: DataTypes.DATE,
		},
		updated_at: {
			type: DataTypes.DATE,
		},
		role: {
			type: DataTypes.ENUM("owner", "team_lead", "unit_head", "agent"),
			allowNull: false,
		},
		manager_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
		},
	},
	{
		tableName: "users",
		underscored: true,
		timestamps: true,
	}
);

User.associate = function (models) {
	// User.belongsTo(models.Company, {
	// 	foreignKey: "company_id",
	// 	onDelete: "CASCADE",
	// 	onUpdate: "CASCADE",
	// });

	// User.belongsTo(models.Country, {
	// 	foreignKey: "country_id",
	// 	onDelete: "SET NULL",
	// 	onUpdate: "CASCADE",
	// });

	User.hasMany(models.UserPermission, {
		foreignKey: "user_id",
	});
};

module.exports = User;

// ALTER TABLE test.users
// ADD COLUMN role ENUM('owner', 'team_lead', 'agent','unit_head') NOT NULL DEFAULT 'agent',
// ADD COLUMN manager_id INT UNSIGNED DEFAULT NULL,
// ADD CONSTRAINT fk_manager
//   FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;
