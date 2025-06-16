const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Country = sequelize.define(
	"Country",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		iso: {
			type: DataTypes.CHAR(2),
			allowNull: false,
			validate: {
				len: [2, 2],
			},
		},
		name: {
			type: DataTypes.STRING(80),
			allowNull: false,
		},
		nicename: {
			type: DataTypes.STRING(80),
			allowNull: false,
		},
		iso3: {
			type: DataTypes.CHAR(3),
			allowNull: true,
			validate: {
				len: [3, 3],
			},
		},
		numcode: {
			type: DataTypes.SMALLINT,
			allowNull: true,
		},
		phonecode: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 0,
			validate: {
				isIn: [[0, 1]],
			},
		},
	},
	{
		tableName: "countries",
		timestamps: false,
		underscored: true,
	}
);

module.exports = Country;
