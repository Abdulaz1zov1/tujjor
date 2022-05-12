const router = require('express').Router();
const HelpController = require('../controllers/HelpController')

router.post('/create', HelpController.create);
router.get('/all', HelpController.getAll);
router.get('/:slug', HelpController.getOne);
router.put('/:id', HelpController.edit);
router.delete('/:id', HelpController.delete);

//client
router.get('/client/all', HelpController.getClientAll);
module.exports = router;