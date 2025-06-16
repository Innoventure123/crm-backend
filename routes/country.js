var express = require("express");
const { getAllCountries, getCountryById } = require("../controllers/country");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllCountries", getAllCountries);

router.get("/getCountryById/:id", getCountryById);

module.exports = router;
