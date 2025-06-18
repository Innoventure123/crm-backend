var express = require("express");
const { getAllProjects, getProjectById } = require("../controllers/projects");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllProjects", verifyToken, getAllProjects);

router.get("/getProjectById/:id", verifyToken, getProjectById);

module.exports = router;
