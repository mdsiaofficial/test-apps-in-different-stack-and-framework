const express = require('express');
const c = require('../controllers/searchController');

const router = express.Router();
router.get('/search', c.search);

module.exports = router;
