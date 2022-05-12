const router = require('express').Router();
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const NewsController = require('../controllers/NewsController');
const { validateFile } = require('../middleware/errorFileUpload');
const { protectAdmin } = require("../middleware/auth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('video')) {
            cb(null, './public/uploads/news/videos');
        } else {
            cb(null, './public/uploads/news/images');
        }
    },
    filename: function (req,file,cb) {
        cb(null, `${md5(Date.now())}${path.extname(file.originalname)}`);
    }
});
const upload = multer({storage: storage});

//admin
router.post('/create', protectAdmin, upload.single('file'), validateFile, NewsController.create);
router.get('/admin/all', protectAdmin, NewsController.getAll);
router.put('/:id', protectAdmin, NewsController.edit);
router.put('/file/:id', protectAdmin, upload.single('file'), validateFile, NewsController.editFile);
router.delete('/:id', protectAdmin, NewsController.delete);

//client
router.get('/all', NewsController.getClientAll);
router.get('/:slug', NewsController.getOne);
module.exports = router;