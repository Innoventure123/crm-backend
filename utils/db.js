const Sequelize = require("sequelize");

const sequelize = new Sequelize(
	process.env.DB,
	process.env.DB_USER,
	process.env.PASS,
	{
		host: process.env.HOST,
		dialect: process.env.DIALECT,
	}
);

// Sync the database
// sequelize
// 	.sync({ alter: true }) // Use force: false to avoid dropping tables in production
// 	.then(() => {
// 		console.log("Database synced successfully");
// 	})
// 	.catch((err) => {
// 		console.error("Error syncing database:", err);
// 	});

module.exports = sequelize;
