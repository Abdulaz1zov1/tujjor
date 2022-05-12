const router = require('express').Router();
const QuestionController = require('../controllers/QuestionController')
const { protectAdmin } = require("../middleware/auth");
router.post('/create', QuestionController.create);
router.get('/all', protectAdmin, QuestionController.getAll);
router.delete('/:id', protectAdmin, QuestionController.delete);

module.exports = router;