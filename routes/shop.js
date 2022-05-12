const router = require("express").Router();
const ShopController = require("../controllers/ShopController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { protectAdmin, protectSeller, protectClient } = require("../middleware/auth");
const { validateFile } = require("../middleware/errorFileUpload");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/shops");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });

//admin
router.get("/all", protectAdmin, ShopController.getShops);
router.get("/contract/all", protectAdmin, ShopController.getContracts);
router.get("/one/:id", protectAdmin, ShopController.getOneAdmin);
router.put("/status/:id", protectAdmin, ShopController.editStatus);
router.put("/product/show/:id", protectAdmin, ShopController.editToSeeProducts);
router.put("/admin/update/:id", protectAdmin, ShopController.updateItems);
router.delete("/user/:id", protectAdmin, ShopController.delete);

//seller
router.put("/update", protectSeller, ShopController.edit);
router.get("/me", protectSeller, ShopController.getMe);
router.get("/user/me", protectClient, ShopController.getMe);

//client
router.get("/client/:slug", ShopController.getOneClient);
router.get("/all/filter", ShopController.getShopsClient);
router.post( "/image/upload", protectClient, upload.single("image"), validateFile, ShopController.imageUpload);

//for create Shop
router.post("/temp/create", protectClient, ShopController.createMyNote);
router.get("/temp/:code", protectClient, ShopController.findMyNotes);
router.delete("/me", protectClient, ShopController.deleteMe);
router.post(
    "/create",
    protectClient,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "fileContract", maxCount: 1 },
        { name: "fileCertificate", maxCount: 1 },
    ]),
    validateFile,
    ShopController.create
);

module.exports = router;
