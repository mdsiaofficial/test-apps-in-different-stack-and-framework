const express = require('express');
const c = require('../controllers/statsController');

const router = express.Router();
router.get('/summary', c.summary);

module.exports = router;
