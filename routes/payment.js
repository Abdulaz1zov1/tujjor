const router = require("express").Router();
const PaymentController = require("../controllers/PaymentController");

router.post("/", PaymentController.payme);

module.exports = router;
