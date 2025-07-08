const { Op, fn, literal } = require("sequelize");
const User = require("../models/users");

const bulkUpdateUsersWithManager = async (data) => {
	try {
		const arr = [];
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
				arr.push({ team_lead });
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
					arr.push({ agent: name });

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
		console.log("✅ Bulk update completed.", JSON.stringify(arr));
	} catch (error) {
		console.error("🔥 Error during bulk update:", error);
	}
};

const data = [
	{
		team_lead: "Fahaz",
		users: [
			{ name: "Rafeek", new_role: "agent" },
			{ name: "Ambika", new_role: "agent" },
			{ name: "Divya Lekshmi", new_role: "agent" },
			{ name: "Sunita", new_role: "agent" },
			{ name: "Heena", new_role: "agent" },
			{ name: "Bipin", new_role: "agent" },
			{ name: "Mishiel", new_role: "agent" },
			{ name: "Kent", new_role: "agent" },
		],
	},
	// {
	// 	team_lead: "Wenica",
	// 	users: [
	// 		{ name: "Carmen", new_role: "agent" },
	// 		{ name: "James", new_role: "agent" },
	// 		{ name: "Rochelle", new_role: "agent" },
	// 		{ name: "Saddam", new_role: "agent" },
	// 		{ name: "Basit", new_role: "agent" },
	// 		{ name: "Kenneth", new_role: "agent" },
	// 		{ name: "Misheil", new_role: "agent" },
	// 		{ name: "Xander", new_role: "agent" },
	// 		{ name: "Sam", new_role: "agent" },
	// 		{ name: "Kent", new_role: "agent" },
	// 		{ name: "Dae", new_role: "agent" },
	// 	],
	// },
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
	// {
	// 	team_lead: "Reny",
	// 	users: [
	// 		{ name: "Val", new_role: "agent" },
	// 		{ name: "Datu", new_role: "agent" },
	// 		{ name: "Ruksana (New)", new_role: "agent" },
	// 		{ name: "Hemanth (New)", new_role: "agent" },
	// 	],
	// },
	// {
	// 	team_lead: "Braj",
	// 	users: [
	// 		{ name: "Venky", new_role: "agent" },
	// 		{ name: "Chinnie", new_role: "agent" },
	// 		{ name: "Fahad Iqbal", new_role: "process_head" },
	// 		{ name: "Faisal", new_role: "agent" },
	// 		{ name: "Nishanta", new_role: "agent" },
	// 		{ name: "Remaz", new_role: "agent" },
	// 		{ name: "Lourdes", new_role: "agent" },
	// 		{ name: "Asif", new_role: "agent" },
	// 		{ name: "Kamal", new_role: "agent" },
	// 	],
	// },
	// {
	// 	team_lead: "Rasil",
	// 	users: [
	// 		// { name: "Rasil (ATL)", new_role: "agent" },
	// 		{ name: "Mansour", new_role: "agent" },
	// 		{ name: "Janu", new_role: "agent" },
	// 		{ name: "Niyas", new_role: "agent" },
	// 	],
	// },
	{
		team_lead: "Amil",
		users: [
			{ name: "Chrisvel J", new_role: "agent" },
			{ name: "Imran", new_role: "agent" },
			{ name: "Prabha SH", new_role: "agent" },
			{ name: "Talha Ansari", new_role: "agent" },
			{ name: "Harsh", new_role: "agent" },
			{ name: "Rochelle", new_role: "agent" },
			{ name: "Ashwini", new_role: "agent" },
			{ name: "Basit", new_role: "agent" },
		],
	},
	{
		team_lead: "Sameer",
		users: [
			{ name: "Pratibha K", new_role: "agent" },
			{ name: "Mashak Shaikh", new_role: "agent" },
			{ name: "Priyanka", new_role: "agent" },
			{ name: "Kenneth", new_role: "agent" },
			{ name: "James", new_role: "agent" },
			{ name: "Vikas Mishra", new_role: "agent" },
			{ name: "Yudi Krishna", new_role: "agent" },
			{ name: "Saddam", new_role: "agent" },
		],
	},
	{
		team_lead: "Libi",
		users: [
			{ name: "Hanif", new_role: "agent" },
			{ name: "Ravi", new_role: "agent" },
			{ name: "Deepti", new_role: "agent" },
		],
	},
];

bulkUpdateUsersWithManager(data);

const STATUS_LIST = [
	"Interested",
	"Under Process",
	"Approved",
	"Rejected",
	"Follow-up",
	"Not Interested",
];

exports.rowsToStatMap = (rows) => {
	const result = Object.fromEntries(STATUS_LIST.map((s) => [s, 0]));
	rows.forEach((row) => {
		result[row.status] = +row.dataValues.count;
	});
	return result;
};

exports.caseCount = (status) =>
	fn(
		"SUM",
		literal(`CASE WHEN \`Call\`.\`status\` = '${status}' THEN 1 ELSE 0 END`)
	);

exports.periodFilter = (start, end) => {
	if (!start || !end) return {};
	return {
		created_at: {
			[Op.between]: [
				new Date(`${start}T00:00:00.000Z`),
				new Date(`${end}T23:59:59.999Z`),
			],
		},
	};
};

const bcrypt = require("bcrypt");

const updateAllUserPasswords = async () => {
	try {
		const users = await User.findAll();

		const arr = [];

		for (const user of users) {
			if (!user.email.includes("@")) continue;

			const [namePart] = user.email.split("@");
			const rawPassword = namePart + "@" + user.id + "IFB";
			const hashedPassword = await bcrypt.hash(rawPassword, 10);

			await User.update(
				{ password: hashedPassword },
				{ where: { id: user.id } }
			);

			console.log(`Updated password for ${user.email}`);

			arr.push({ email: user.email, password: rawPassword });
		}

		console.log("All user passwords updated (hashed).", JSON.stringify(arr));
	} catch (error) {
		console.error("Error updating user passwords:", error.message);
	}
};

// updateAllUserPasswords();
