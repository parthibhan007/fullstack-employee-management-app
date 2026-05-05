const router = require("express").Router();
const controller = require("../controllers/employeeController");

router.post("/", controller.createEmployee);
router.get("/", controller.getEmployees);
router.get("/:id", controller.getEmployeeById);
router.put("/:id", controller.updateEmployee);
router.delete("/:id", controller.deleteEmployee);

module.exports = router;