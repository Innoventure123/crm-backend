const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Product = sequelize.define(
	"Product",
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		company_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
		name: { type: DataTypes.STRING, allowNull: false },
		price: { type: DataTypes.STRING, allowNull: false },
		taxes: { type: DataTypes.STRING },
		allow_purchase: { type: DataTypes.TINYINT, defaultValue: 0 },
		downloadable: { type: DataTypes.TINYINT, defaultValue: 0 },
		downloadable_file: { type: DataTypes.STRING },
		description: { type: DataTypes.TEXT },
		category_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
		sub_category_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
		added_by: { type: DataTypes.INTEGER.UNSIGNED },
		last_updated_by: { type: DataTypes.INTEGER.UNSIGNED },
		hsn_sac_code: { type: DataTypes.STRING },
		default_image: { type: DataTypes.STRING },
	},
	{
		tableName: "products",
		timestamps: true,
		underscored: true,
	}
);

Product.associate = (models) => {
	// Product.belongsTo(models.Company, { foreignKey: "company_id" });
	// Product.belongsTo(models.ProductCategory, { foreignKey: "category_id" });
	// Product.belongsTo(models.ProductSubCategory, {
	// 	foreignKey: "sub_category_id",
	// });
	Product.belongsTo(models.User, { as: "addedBy", foreignKey: "added_by" });
	Product.belongsTo(models.User, {
		as: "updatedBy",
		foreignKey: "last_updated_by",
	});
};

module.exports = Product;
