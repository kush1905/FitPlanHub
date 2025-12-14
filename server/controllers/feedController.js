const Plan = require('../models/Plan');
const User = require('../models/User');

/**
 * @desc    Get personalized feed (plans from followed trainers)
 * @route   GET /api/feed
 * @access  Private (User)
 */
const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get plans from followed trainers
    const plans = await Plan.find({
      trainer: { $in: user.followedTrainers },
    })
      .populate('trainer', 'name email')
      .sort('-createdAt');

    // Get user's purchased plans for marking
    const userPurchasedPlans = user.purchasedPlans.map((id) => id.toString());

    // Format plans with subscription status
    const formattedPlans = plans.map((plan) => {
      const isSubscribed = userPurchasedPlans.includes(plan._id.toString());

      return {
        _id: plan._id,
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        trainer: plan.trainer,
        subscribersCount: plan.subscribers.length,
        isSubscribed,
        createdAt: plan.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedPlans.length,
      data: formattedPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getFeed,
};

