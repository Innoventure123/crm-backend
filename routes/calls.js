var express = require("express");
const { getAllCallListing, getCallById } = require("../controllers/calls");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllCallListing", getAllCallListing);

router.get("/getCallById/:id", getCallById);

module.exports = router;
