var express = require("express");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects");
const { validateBody } = require("../utils/validateChecker");
const { schema } = require("../utils/validationSchema");
var router = express.Router();
const verifyToken = require("../middleware/verifyToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/getAllProjects", verifyToken, getAllProjects);

router.get("/getProjectById/:id", verifyToken, getProjectById);

router.post(
  "/createProject",
  verifyToken,
  validateBody(schema.createProjectSchema),
  createProject,
);

router.put(
  "/updateProject/:id",
  verifyToken,
  validateBody(schema.updateProjectSchema),
  updateProject,
);

router.delete("/deleteProject/:id", verifyToken, deleteProject);

module.exports = router;
