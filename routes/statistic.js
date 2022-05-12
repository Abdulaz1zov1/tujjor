const router = require("express").Router();
const Statistic = require("../controllers/Statistic");
const { protectAdmin, protectSeller} = require("../middleware/auth")
router.post("/shops",protectAdmin, Statistic.statShop);
router.post("/brands",protectAdmin, Statistic.statBrand);
router.post("/users",protectAdmin, Statistic.statUser);
router.post("/category",protectAdmin, Statistic.statCategory);
router.get("/dashboard",protectAdmin, Statistic.dashboardAdmin);
router.get("/shop/dashboard",protectSeller, Statistic.dashboardShop);

module.exports = router;
