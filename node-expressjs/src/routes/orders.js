const express = require('express');
const c = require('../controllers/ordersController');

const router = express.Router();
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', c.create);
router.get('/:id/items', c.listItems);

module.exports = router;
