const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./users");
const Permission = require("./permission");
const PermissionType = require("./permission_type");

const UserPermission = sequelize.define(
	"UserPermission",
	{
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		permission_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		permission_type_id: {
			type: DataTypes.BIGINT.UNSIGNED,
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
		tableName: "user_permissions",
		underscored: true,
		timestamps: true,
	}
);

UserPermission.associate = function (models) {
	UserPermission.belongsTo(models.User, {
		foreignKey: "user_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	UserPermission.belongsTo(models.Permission, {
		foreignKey: "permission_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	UserPermission.belongsTo(models.PermissionType, {
		foreignKey: "permission_type_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});
};

module.exports = UserPermission;
