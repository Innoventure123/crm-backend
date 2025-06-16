var express = require("express");
const { getAll, login } = require("../controllers/users");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAll", getAll);

router.post("/login", login);

module.exports = router;
