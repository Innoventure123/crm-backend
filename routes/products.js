var express = require("express");
const { getAllProducts, getProductById } = require("../controllers/products");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllProducts", getAllProducts);

router.get("/getProductById/:id", getProductById);

module.exports = router;
