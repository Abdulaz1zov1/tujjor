const router = require('express').Router();
const errorHandler = require("../middleware/error");

router.use("/api/home", require("./home"));
router.use("/api/stat", require("./statistic"));
router.use("/api/message", require("./message"));
router.use("/api/payme", require("./payment"));
router.use("/api/region", require("./regions"));
router.use("/api/like", require("./like"));
router.use("/api/order", require("./order"));
router.use("/api/tag", require("./tag"));
router.use("/api/basket", require("./basket"));
router.use("/api/category", require("./category"));
router.use("/api/banner", require("./banner"));
router.use("/api/slider", require("./slider"));
router.use("/api/question", require("./question"));
router.use("/api/application", require("./applicationShop"));
router.use("/api/user", require("./user"));
router.use("/api/shop", require("./shop"));
router.use("/api/brand", require("./brand"));
router.use("/api/uploads", require("./images"));
router.use("/api/help", require("./help"));
router.use("/api/info", require("./info"));
router.use("/api/news", require("./news"));
router.use("/api/product", require("./product"));
router.use(errorHandler)

module.exports = router;