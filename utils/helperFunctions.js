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

// bulkUpdateUsersWithManager(data);

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

async function insertNewUser() {
	const users = [
		// {
		// 	name: "Divya Lekshmi",
		// 	email: "divya@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// { name: "Bipin", email: "bipin@innoventure.ae", role: "agent", role_id: 5 },
		// {
		// 	name: "Mishiel",
		// 	email: "mishiel@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// { name: "Kent", email: "kent@innoventure.ae", role: "agent", role_id: 5 },
		// {
		// 	name: "Mahmoud Gaber",
		// 	email: "mahmoud@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Sayed Atef",
		// 	email: "sayed@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// { name: "Nada", email: "nada@innoventure.ae", role: "agent", role_id: 5 },
		// { name: "Sinan", email: "sinan@innoventure.ae", role: "agent", role_id: 5 },
		// {
		// 	name: "Abdallah Salag",
		// 	email: "salag@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Mustafa",
		// 	email: "mustafa@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Abdallah Bakhit",
		// 	email: "bakhit@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Amil",
		// 	email: "amil@innoventure.ae",
		// 	role: "team_lead",
		// 	role_id: 4,
		// },
		// {
		// 	name: "Sameer",
		// 	email: "sameer@innoventure.ae",
		// 	role: "team_lead",
		// 	role_id: 4,
		// },
		// {
		// 	name: "Libi",
		// 	email: "libi@innoventure.ae",
		// 	role: "team_lead",
		// 	role_id: 4,
		// },
		// {
		// 	name: "Chrisvel J",
		// 	email: "chrisvel@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// { name: "Imran", email: "imran@innoventure.ae", role: "agent", role_id: 5 },
		// {
		// 	name: "Prabha SH",
		// 	email: "prabha@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Talha Ansari",
		// 	email: "talha@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// { name: "Harsh", email: "harsh@innoventure.ae", role: "agent", role_id: 5 },
		// {
		// 	name: "Ashwini",
		// 	email: "ashwini@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Pratibha K",
		// 	email: "pratibha@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Mashak Shaikh",
		// 	email: "mashak@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Vikas Mishra",
		// 	email: "vikas@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Yudi Krishna",
		// 	email: "yudi@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// { name: "Hanif", email: "hanif@innoventure.ae", role: "agent", role_id: 5 },
		// {
		// 	name: "Deepti",
		// 	email: "deepti@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },

		// {
		// 	name: "Ravi",
		// 	email: "ravi@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Ahmad Saber",
		// 	email: "ahmed@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Kinjal",
		// 	email: "kinjal@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		// {
		// 	name: "Krishna",
		// 	email: "krishna@innoventure.ae",
		// 	role: "agent",
		// 	role_id: 5,
		// },
		{
			name: "Niyas",
			email: "niyas@innoventure.ae",
			role: "agent",
			role_id: 5,
		},
		{
			name: "Edin",
			email: "edin@innoventure.ae",
			role: "agent",
			role_id: 5,
		},
		{
			name: "Tamer",
			email: "tamer@innoventure.ae",
			role: "agent",
			role_id: 5,
		},
		{
			name: "Samual",
			email: "samual@innoventure.ae",
			role: "agent",
			role_id: 5,
		},
	];

	const insertedUsers = await User.bulkCreate(users, { returning: true });
	const arr = [];
	for (const user of insertedUsers) {
		const [namePart] = user.email.split("@");
		const rawPassword = `${namePart}@${user.id}IFB`;
		const hashedPassword = await bcrypt.hash(rawPassword, 10);
		arr.push({ email: user.email, password: rawPassword });
		await User.update({ password: hashedPassword }, { where: { id: user.id } });
	}
	console.log(JSON.stringify(arr));
}

// insertNewUser();

const deactivateUsers = async (emailList) => {
	try {
		const result = await User.update(
			{ status: "deactive" },
			{ where: { email: emailList } }
		);
		console.log(`Deactivated ${result[0]} users.`);
	} catch (error) {
		console.error("Error deactivating users:", error.message);
	}
};

// Usage example:
const emailsToDeactivate = [
	"vicky@innoventure.ae",
	"marilou@innoventure.ae",
	"sunil@innoventure.ae",
	"akshay@innoventure.ae",
	"abdallah@innoventure.ae",
	"dhruvi@innoventure.ae",
	"stella@innoventure.ae",
	"usman@innoventure.ae",
	"dhananjay@innoventure.ae",
	"anup@innoventure.ae",
	"mahmoud@innoventure.ae",
	"jestin@innoventure.ae",
	"imasha@innoventure.ae",
	"kashmeera@innovennture.ae",
	"hein@innoventure.ae",
	"suryaga@innoventure.ae",
	"ellen@innoventure.ae",
	"admin@innoventure.ae",
	"jerlin@innoventure.ae",
	"hassan@innoventure.ae",
	"latifa@innoventure.ae",
	"farman@innoventure.ae",
	"rahul@innoventure.ae",
	"support@innoventure.ae",
	"syed@innoventure.ae",
	"ayesha@innoventure.ae",
	"rashee@innoventure.ae",
	"ebin@innoventure.ae",
	"pranoy@inoventure.ae",
	"sanjot@innoventure.ae",
	"mohamed@innoventure.ae",
	"nishanta@innoventure.ae",
	"sayed@innoventure.ae",
	"taimoor@innoventure.ae",
	"rizwan@innoventure.ae",
	"saima@innoventure.ae",
	"farooq@innoventure.ae",
	"avinash@innoventure.ae",
	"moiz@innoventure.ae",
	"jinky@innoventure.ae",
	"azza@innoventure.ae",
	"pramod@innoventure.ae",
	"Mantu@innoventure.ae",
	"mehtab@innoventure.ae",
	"ramesh@innoventure.ae",
	"ahmad@innoventure.ae",
	"madhav@innoventure.ae",
	"datu@innoventure.ae",
	"rex@innoventure.ae",
	"asmaa@innoventure.ae",
	"rafiq@innoventure.ae",
	"ahsan@innoventure.ae",
	"asheeka@innoventure.ae",
	"oman@innoventure.ae",
	"lijo@innoventure.ae",
	"ganesh@innoventure.ae",
	"mohamed.faook@innoventure.ae",
	"shani@innoventure.ae",
	"shamz@innoventure.ae",
	"mayank@innoventure.ae",
	"vikram@innoventure.ae",
	"manjot@innoventure.ae",
	"safwan@innoventure.ae",
	"hani@innoventure.ae",
	"fawad@innoventure.ae",
	"nashib@innoventure.ae",
	"ismaeil@innoventure.ae",
	"amit@innoventure.ae",
	"remza@innoventure.ae",
	"bilal@innoventure.ae",
	"latha@innoventure.ae",
	"nazeer@innoventure.ae",
	"testemp@gmail.com",
	"murtaza@innoventure.ae",
	"arvind@innoventure.ae",
	"rameez@innoventure.ae",
	"abdelrahman@innoventure.ae",
	"maria@innoventure.ae",
	"wenica@innoventure.ae",
	"manali@innoventure.ae",
	"wasif@innoventure.ae",
	"backend@innoventure.ae",
	"emad@innoventure.ae",
	"ghani@innoventure.ae",
	"zargam@innoventure.ae",
	"sombir@innoventure.ae",
	"nazia@innoventure.ae",
	"rashid@innoventure.ae",
	"ali@innoventure.ae",
	"atif@innoventure.ae",
	"jenivi@innoventure.ae",
	"hamza@innoventure.ae",
	"pragya@innoventure.ae",
	"mohamed2@innoventure.ae",
	"marlon@innoventure.ae",
	"mercy@innoventure.ae",
	"james@innoventure.ae",
	"nayeema@innoventure.ae",
	"ramisha@innoventure.ae",
	"anshika@innoventure.ae",
	"kriti@innoventure.ae",
	"ashira@innoventure.ae",
	"gamal@innoventure.ae",
	"sarah@innoventure.ae",
	"ayub@innoventure.ae",
	"jotish@innoventure.ae",
	"karim@innoventure.ae",
	"val@innoventure.ae",
	"bipin@innoventure.ae",
	"rose@innoventure.ae",
	"haris@innoventure.ae",
	"naushad@innoventure.ae",
	"kenneth@innoventure.ae",
	"jovelyn@innoventure.ae",
	"asif@innoventure.ae",
	"dilshad@innoventure.ae",
	"deepthi@innoventure.ae",
	"jaheer@innoventure.ae",
	"priyanka@innoventure.ae",
	"kamana@innovenutre.ae",
	"issath@innovenutre.ae",
	"muskan@innoventure.ae",
	"misbah@innoventure.ae",
	"areesha@innoventure.ae",
	"raaesdah@innoventure.ae",
	"hassanR@innoventure.ae",
	"wesam@innoventure.ae",
	"maisa@innoventure.ae",
	"Rameshk@innoventure.ae",
	"sayd@innoventure.ae",
	"Mohamede@innoventure.ae",
	"mahmoudm@innoventure.ae",
	"syeda@innoventure.ae",
	"test@innoventure.ae",
	"caesarapf@gmail.com",
	"abdallahbekhit@innoventure.ae",
	"ahmedyehya@innoventure.ae",
	"fatima@innoventure.ae",
	"janu@innoventure.ae",
	"lourdes@innoventure.ae",
	"imtiyaz@innoventure.ae",
	"mishiel@innoventure.ae",
	"mahmoud@innoventure.ae",
	"sayed@innoventure.ae",
	"salag@innoventure.ae",
	"mustafa@innoventure.ae",
	"bakhit@innoventure.ae",
	"amil@innoventure.ae",
	"sameer@innoventure.ae",
	"chrisvel@innoventure.ae",
	"imran@innoventure.ae",
	"prabha@innoventure.ae",
	"talha@innoventure.ae",
	"harsh@innoventure.ae",
	"ashwini@innoventure.ae",
	"pratibha@innoventure.ae",
	"mashak@innoventure.ae",
	"deepti@innoventure.ae",
];

// deactivateUsers(emailsToDeactivate);
