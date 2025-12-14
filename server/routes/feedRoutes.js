const express = require('express');
const router = express.Router();
const { getFeed } = require('../controllers/feedController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Protected route (User only)
router.get('/', protect, authorize('user'), getFeed);

module.exports = router;

