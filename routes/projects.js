var express = require("express");
const { getAllProjects, getProjectById } = require("../controllers/projects");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllProjects", getAllProjects);

router.get("/getProjectById/:id", getProjectById);

module.exports = router;
