var express = require("express");
const {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/products");
const { validateBody } = require("../utils/validateChecker");
const { schema } = require("../utils/validationSchema");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/getAllProducts", verifyToken, getAllProducts);

router.get("/getProductById/:id", verifyToken, getProductById);

router.post(
	"/createProduct",
	verifyToken,
	validateBody(schema.createProductSchema),
	createProduct
);

router.put(
	"/updateProduct/:id",
	verifyToken,
	validateBody(schema.updateProductSchema),
	updateProduct
);

router.delete("/deleteProduct/:id", verifyToken, deleteProduct);

module.exports = router;
