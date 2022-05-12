const router = require("express").Router();
const BasketController = require("../controllers/BasketController");
const { protectClient } = require("../middleware/auth");

router.post("/create", protectClient, BasketController.create);
router.get("/all", protectClient, BasketController.getAll);
router.get("/count", protectClient, BasketController.getCount);
router.put("/:id", protectClient, BasketController.edit);
router.delete("/:id", protectClient, BasketController.delete);
router.delete("/rm/all", protectClient, BasketController.deleteAll);

module.exports = router;
