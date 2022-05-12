const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const multer = require("multer");
const md5 = require("md5");
const path = require("path");
const { validateFile } = require("../middleware/errorFileUpload");
const { protectClient, protectSeller } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });
//TEST
// router.post("/test", ProductController.TEST);
// router.post("/remove", ProductController.REMOVE);

//get all && filter
router.post("/all", protectSeller, ProductController.getAll);
router.get("/:slug", ProductController.getOneClient);
router.get("/seller/:slug", ProductController.getOneSeller);
router.post("/filter", ProductController.filter);
router.post("/count", ProductController.count);

//create
router.post("/comment/create", protectClient, ProductController.commentCreate);
router.post("/create", protectSeller, upload.single("image"), validateFile, ProductController.create);
router.post(
    "/param/create",
    protectSeller,
    upload.single("image"),
    validateFile,
    ProductController.createParam
);
router.post("/size/create", protectSeller, ProductController.createSize);
router.post(
    "/image/create",
    protectSeller,
    upload.single("image"),
    validateFile,
    ProductController.createImage
);
router.post(
    "/footerimage/create",
    protectSeller,
    upload.single("image"),
    validateFile,
    ProductController.createFooterImage
);

//discount
router.post("/discount/create", protectSeller, ProductController.createDiscount);
router.post("/discount/create/all", protectSeller, ProductController.createDiscountAll);

//update
router.put("/:id", protectSeller, ProductController.edit);
router.put("/cardImage/:id", protectSeller, upload.single("image"), validateFile, ProductController.editCardImage);
router.put(
    "/param/:id",
    protectSeller,
    upload.single("image"),
    validateFile,
    ProductController.editParam
);
router.put("/size/:id", protectSeller, ProductController.editSize);

//delete
router.delete("/:id", protectSeller, ProductController.delete);
router.delete("/image/:id", protectSeller, ProductController.deleteImage);
router.delete("/footerImage/:id", protectSeller, ProductController.deleteFooterImage);
router.delete("/param/:id", protectSeller, ProductController.deleteParam);
router.delete("/size/:id", protectSeller, ProductController.deleteSize);

module.exports = router;
