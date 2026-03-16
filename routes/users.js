var express = require("express");
const {
	getAll,
	getById,
	login,
	getAllAgentsListing,
	getAllUsers,
	getTeamLeaders,
	createUser,
	updateUser,
	activateUser,
	deactivateUser,
	updateUserStatus,
} = require("../controllers/users");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { validateBody } = require("../utils/validateChecker");
const { schema } = require("../utils/validationSchema");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAll", getAll);
router.get("/getById/:id", verifyToken, getById);

router.post("/login", login);

router.get("/getAllAgentsListing", verifyToken, getAllAgentsListing);

// Admin user management
router.get("/getAllUsers", verifyToken, getAllUsers);
router.get("/getTeamLeaders", verifyToken, getTeamLeaders);
router.post("/createUser", verifyToken, validateBody(schema.createUserSchema), createUser);
router.put(
	"/updateUser/:id",
	verifyToken,
	validateBody(schema.updateUserSchema),
	updateUser
);
router.put("/activateUser/:id", verifyToken, activateUser);
router.put("/deactivateUser/:id", verifyToken, deactivateUser);
router.put(
	"/updateUserStatus/:id",
	verifyToken,
	validateBody(schema.updateUserStatusSchema),
	updateUserStatus
);

module.exports = router;
