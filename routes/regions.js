const express = require("express");
const router = express.Router();
const Regions = require("../controllers/RegionsController");
const { protectAdmin } = require("../middleware/auth");
router.post("/create", protectAdmin, Regions.addRegion);
router.get("/all", Regions.getRegions);
router.get("/admin/all", protectAdmin, Regions.getRegionsForAdmin);
router.put("/:id", protectAdmin, Regions.editRegion);
router.delete("/:id", protectAdmin, Regions.deleteRegion);

router.post("/district/create", protectAdmin, Regions.addDistrict);
router.put("/district/:id", protectAdmin, Regions.updateDistrict);
router.delete("/district/:id", protectAdmin, Regions.deleteDistrict);

module.exports = router;
