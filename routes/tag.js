const router = require("express").Router();
const TagController = require("../controllers/TagController");
const { protectAdmin } = require("../middleware/auth");

router.post("/create", protectAdmin, TagController.create);
router.get("/all", protectAdmin, TagController.all);
router.delete("/:id", protectAdmin, TagController.delete);

module.exports = router;
