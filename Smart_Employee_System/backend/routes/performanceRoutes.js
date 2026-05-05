const router = require("express").Router();
const controller = require("../controllers/performanceController");

router.post("/", controller.addPerformance);
router.get("/", controller.getPerformance);

module.exports = router;