const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const PermissionType = sequelize.define(
	"PermissionType",
	{
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(191),
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
		tableName: "permission_types",
		underscored: true,
		timestamps: true,
	}
);

PermissionType.associate = function (models) {
	PermissionType.hasMany(models.UserPermission, {
		foreignKey: "permission_type_id",
	});
};

module.exports = PermissionType;
