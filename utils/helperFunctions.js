const { Op } = require("sequelize");
const User = require("../models/users");

const bulkUpdateUsersWithManager = async (data) => {
	try {
		for (const group of data) {
			const { team_lead, users } = group;

			// Find the team lead using LIKE for name
			const manager = await User.findOne({
				where: {
					name: { [Op.like]: `%${team_lead}%` },
					// role: "team_lead",
				},
			});
			if (!manager) {
				console.warn(
					`⚠️ Team lead "${team_lead}" not found or not a team_lead. Skipping this group.`
				);
				continue;
			}

			if (manager.name == "Braj") {
				manager.role = "owner";
				manager.role_id = 1;
			} else {
				manager.role = "team_lead";
				manager.role_id = 4;
			}

			await manager.save();
			console.log(`✅ Updated team lead: ${manager.name} to role=team_lead`);
			// Loop through each user under the team lead
			for (const userInfo of users) {
				const { name, new_role } = userInfo;

				const user = await User.findOne({
					where: {
						name: { [Op.like]: `%${name}%` },
					},
				});
				if (!user) {
					console.warn(`❌ User "${name}" not found. Skipping.`);
					continue;
				}

				user.role = new_role;
				user.role_id = 5;
				user.manager_id = manager.id;

				await user.save();
				console.log(
					`✅ Updated ${user.name}: role=${new_role}, manager=${team_lead}`
				);
			}
		}
		console.log("✅ Bulk update completed.");
	} catch (error) {
		console.error("🔥 Error during bulk update:", error);
	}
};

const data = [
	{
		team_lead: "Fahaz",
		users: [
			{ name: "Sunita", new_role: "agent" },
			{ name: "Ambika", new_role: "agent" },
			{ name: "Bipin", new_role: "agent" },
			{ name: "Heena", new_role: "agent" },
			{ name: "Rafeek", new_role: "agent" },
			{ name: "Syed", new_role: "agent" },
			{ name: "Divya", new_role: "agent" },
			{ name: "Divya Ashok", new_role: "agent" },
		],
	},
	{
		team_lead: "Wenica",
		users: [
			{ name: "Carmen", new_role: "agent" },
			{ name: "James", new_role: "agent" },
			{ name: "Rochelle", new_role: "agent" },
			{ name: "Saddam", new_role: "agent" },
			{ name: "Basit", new_role: "agent" },
			{ name: "Kenneth", new_role: "agent" },
			{ name: "Misheil", new_role: "agent" },
			{ name: "Xander", new_role: "agent" },
			{ name: "Sam", new_role: "agent" },
			{ name: "Kent", new_role: "agent" },
			{ name: "Dae", new_role: "agent" },
		],
	},
	{
		team_lead: "Rabeea",
		users: [
			{ name: "Mahmoud Gaber", new_role: "agent" },
			{ name: "Mohamed Gamal", new_role: "agent" },
			{ name: "Ahmed Saber", new_role: "agent" },
			{ name: "Ahmed Magdi", new_role: "agent" },
			{ name: "Sayed Atef", new_role: "agent" },
			{ name: "Nada", new_role: "agent" },
			{ name: "Sinan", new_role: "agent" },
			{ name: "Abdallah Salag", new_role: "agent" },
			{ name: "Mustafa", new_role: "agent" },
			{ name: "Abdallah Bakhit", new_role: "agent" },
		],
	},
	{
		team_lead: "Reny",
		users: [
			{ name: "Val", new_role: "agent" },
			{ name: "Datu", new_role: "agent" },
			{ name: "Ruksana (New)", new_role: "agent" },
			{ name: "Hemanth (New)", new_role: "agent" },
		],
	},
	{
		team_lead: "Braj",
		users: [
			{ name: "Venky", new_role: "agent" },
			{ name: "Chinnie", new_role: "agent" },
			{ name: "Fahad Iqbal", new_role: "agent" },
			{ name: "Faisal", new_role: "agent" },
			{ name: "Nishanta", new_role: "agent" },
			{ name: "Remaz", new_role: "agent" },
			{ name: "Lourdes", new_role: "agent" },
			{ name: "Asif", new_role: "agent" },
			{ name: "Kamal", new_role: "agent" },
		],
	},
	{
		team_lead: "Rasil",
		users: [
			// { name: "Rasil (ATL)", new_role: "agent" },
			{ name: "Mansour", new_role: "agent" },
			{ name: "Janu", new_role: "agent" },
			{ name: "Niyas", new_role: "agent" },
		],
	},

	{
		team_lead: "AMIL",
		users: [
			{ name: "PRATHIBA", new_role: "agent" },
			{ name: "IMRAN", new_role: "agent" },
			{ name: "CRISH", new_role: "agent" },
			{ name: "PRIYANKA", new_role: "agent" },
			{ name: "TALHA", new_role: "agent" },
			{ name: "PRABHA", new_role: "agent" },
			{ name: "MASHAK", new_role: "agent" },
			{ name: "PRIYANKA", new_role: "agent" },
		],
	},
	{
		team_lead: "SAMEER",
		users: [],
	},
];

// bulkUpdateUsersWithManager(data);
