const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Permission = sequelize.define(
	"Permission",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		display_name: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		module_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		is_custom: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 0,
		},
		allowed_permissions: {
			type: DataTypes.TEXT,
		},
		added_type: {
			type: DataTypes.ENUM("direct", "converted"),
			allowNull: false,
		},
		call_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
		},
		updated_at: {
			type: DataTypes.DATE,
		},
	},
	{
		tableName: "permissions",
		underscored: true,
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ["name", "module_id"],
			},
		],
	}
);

Permission.associate = function (models) {
	// Permission.belongsTo(models.Module, {
	// 	foreignKey: "module_id",
	// 	onDelete: "CASCADE",
	// 	onUpdate: "CASCADE",
	// });

	Permission.hasMany(models.UserPermission, {
		foreignKey: "permission_id",
	});
};

module.exports = Permission;
