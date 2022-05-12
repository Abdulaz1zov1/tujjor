const router = require("express").Router();
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const SliderController = require("../controllers/SliderController");
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

router.post(
    "/create",
    protectAdmin,
    SliderController.create
);
router.get("/all", SliderController.getAll);
router.get("/admin/all", protectAdmin, SliderController.getAllForAdmin);
router.delete("/:id", protectAdmin, SliderController.delete);
router.put("/:id", protectAdmin, SliderController.edit);
router.post("/upload", protectAdmin, upload.single("image"), validateFile, SliderController.uploadImage);

module.exports = router;
