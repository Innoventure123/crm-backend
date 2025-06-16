var express = require("express");
const {
	getAllCallListing,
	getCallById,
	addCall,
	updateCall,
} = require("../controllers/calls");
const { validateBody } = require("../utils/validateChecker");
const { schema } = require("../utils/validationSchema");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post("/addCall", validateBody(schema.createCallSchema), addCall);

router.put(
	"/updateCall/:id",
	validateBody(schema.updateCallSchema),
	updateCall
);

router.get("/getAllCallListing", getAllCallListing);

router.get("/getCallById/:id", getCallById);

module.exports = router;
