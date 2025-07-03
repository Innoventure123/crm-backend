var express = require("express");
const {
	getAllCallListing,
	getCallById,
	addCall,
	updateCall,
	updateStatus,
	deleteCall,
	getCreditQueues,
	getDashboard,
} = require("../controllers/calls");
const { validateBody } = require("../utils/validateChecker");
const { schema } = require("../utils/validationSchema");
const verifyToken = require("../middleware/verifyToken");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

router.post(
	"/addCall",
	verifyToken,
	// validateBody(schema.createCallSchema),
	addCall
);

router.put(
	"/updateCall/:id",
	verifyToken,
	// validateBody(schema.updateCallSchema),
	updateCall
);

router.get("/getAllCallListing", verifyToken, getAllCallListing);

router.get("/getCallById/:id", verifyToken, getCallById);

router.put("/updateStatus/:id", verifyToken, updateStatus);

router.post("/deleteCall/:id", verifyToken, deleteCall);

router.get("/getCreditQueues", verifyToken, getCreditQueues);

router.get("/getDashboard", verifyToken, getDashboard);

module.exports = router;
