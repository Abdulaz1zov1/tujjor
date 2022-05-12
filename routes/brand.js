const router = require("express").Router();
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const BrandController = require("../controllers/BrandController");
const { validateFile } = require("../middleware/errorFileUpload");
const { protectAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

//admin
router.post("/create", protectAdmin, upload.single("image"), validateFile, BrandController.create);
router.put("/:id",protectAdmin, BrandController.edit);
router.put("/image/:id", protectAdmin, upload.single("image"), validateFile, BrandController.editImage);
router.delete("/:id", protectAdmin, BrandController.delete);
router.get("/admin/all", protectAdmin, BrandController.getAllForAdmin);

//client
router.get("/all", BrandController.getAll);
router.get("/:slug", BrandController.getOne);
module.exports = router;
