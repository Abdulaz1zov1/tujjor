const router = require("express").Router();
const MessageController = require("../controllers/MessageController");
const { protectAdmin } = require("../middleware/auth");
router.post("/create", MessageController.create);
router.post("/all", protectAdmin, MessageController.all);

module.exports = router;
