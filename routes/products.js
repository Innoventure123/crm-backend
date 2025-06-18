var express = require("express");
const { getAllProducts, getProductById } = require("../controllers/products");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllProducts", verifyToken, getAllProducts);

router.get("/getProductById/:id", verifyToken, getProductById);

module.exports = router;
