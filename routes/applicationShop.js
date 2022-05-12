const router = require('express').Router();
const ApplicationShopController = require('../controllers/ApplicationShopController')
const { protectClient, protectAdmin } = require("../middleware/auth");

router.get('/all', protectAdmin, ApplicationShopController.getAll);
router.put('/status/:id', protectAdmin, ApplicationShopController.editStatus);

//client
router.delete('/:id', ApplicationShopController.delete);
router.post('/create', protectClient, ApplicationShopController.create);
router.get('/me', protectClient, ApplicationShopController.getOne);
module.exports = router;
