var express = require("express");
const { getAll, login, getAllAgentsListing } = require("../controllers/users");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAll", getAll);

router.post("/login", login);

router.get("/getAllAgentsListing", verifyToken, getAllAgentsListing);

module.exports = router;
