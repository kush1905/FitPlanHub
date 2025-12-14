const express = require('express');
const router = express.Router();
const {
  followTrainer,
  unfollowTrainer,
  getFollowing,
  getTrainers,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');

// Public route
router.get('/trainers', optionalAuth, getTrainers);

// Protected routes (User only)
router.post('/trainers/:id/follow', protect, authorize('user'), followTrainer);
router.post('/trainers/:id/unfollow', protect, authorize('user'), unfollowTrainer);
router.get('/following', protect, authorize('user'), getFollowing);

module.exports = router;

