const express = require('express');
const router = express.Router();
const {
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  deletePlan,
  getTrainerPlans,
  subscribeToPlan,
} = require('../controllers/planController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');

// Public routes (with optional auth for subscription status)
router.get('/', optionalAuth, getPlans);

// Protected routes - specific routes before parameterized routes
router.get('/trainer/plans', protect, authorize('trainer'), getTrainerPlans);
router.post('/', protect, authorize('trainer'), createPlan);
router.post('/:id/subscribe', protect, authorize('user'), subscribeToPlan);

// Parameterized routes (must come after specific routes)
router.get('/:id', optionalAuth, getPlan);
router.put('/:id', protect, authorize('trainer'), updatePlan);
router.delete('/:id', protect, authorize('trainer'), deletePlan);

module.exports = router;

