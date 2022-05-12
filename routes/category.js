const router = require("express").Router();
const CategoryController = require("../controllers/CategoryController");
const { protectAdmin } = require("../middleware/auth");
router.post("/create",protectAdmin, CategoryController.create);
router.get("/admin/all", protectAdmin, CategoryController.getAllForAdmin);
router.get("/all", CategoryController.getAll);
router.get("/:id", CategoryController.getOne);
router.delete("/:id", protectAdmin, CategoryController.delete);
router.put("/:id", protectAdmin, CategoryController.edit);

module.exports = router;
