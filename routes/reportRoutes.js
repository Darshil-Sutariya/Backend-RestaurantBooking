const express = require('express');
const router = express.Router();
const { getFullReport } = require('../controller/reportController');
const verifyToken = require('../middleware/authMiddleware'); //

// GET /api/report/dashboard
router.get('/dashboard', verifyToken, getFullReport);

module.exports = router;