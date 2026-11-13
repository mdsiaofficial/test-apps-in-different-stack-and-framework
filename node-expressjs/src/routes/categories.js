const express = require('express');
const c = require('../controllers/categoriesController');

const router = express.Router();
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', c.create);

module.exports = router;
