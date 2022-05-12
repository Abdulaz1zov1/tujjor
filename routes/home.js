const router = require("express").Router();
const Controller = require("../controllers/Controller");

router.get("/discount", Controller.getDiscounts);
router.get("/popular", Controller.popularProducts);

module.exports = router;
