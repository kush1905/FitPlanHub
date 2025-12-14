const Plan = require('../models/Plan');
const User = require('../models/User');

/**
 * @desc    Create a new plan (Trainer only)
 * @route   POST /api/plans
 * @access  Private (Trainer)
 */
const createPlan = async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    // Validation
    if (!title || !description || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, and duration',
      });
    }

    const plan = await Plan.create({
      title,
      description,
      price,
      duration,
      trainer: req.user._id,
    });

    // Populate trainer info
    await plan.populate('trainer', 'name email');

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Get all plans (with access control)
 * @route   GET /api/plans
 * @access  Public
 */
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate('trainer', 'name email').sort('-createdAt');

    // If user is authenticated, check subscriptions
    let userPurchasedPlans = [];
    if (req.user) {
      const user = await User.findById(req.user._id);
      userPurchasedPlans = user.purchasedPlans.map((id) => id.toString());
    }

    // Format response based on subscription status
    const formattedPlans = plans.map((plan) => {
      const isSubscribed = userPurchasedPlans.includes(plan._id.toString());

      if (isSubscribed) {
        // Full details for subscribers
        return {
          _id: plan._id,
          title: plan.title,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer,
          subscribersCount: plan.subscribers.length,
          isSubscribed: true,
          createdAt: plan.createdAt,
        };
      } else {
        // Preview only for non-subscribers (including non-authenticated users)
        return {
          _id: plan._id,
          title: plan.title,
          trainer: plan.trainer,
          price: plan.price,
          isSubscribed: false,
        };
      }
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

/**
 * @desc    Get single plan by ID
 * @route   GET /api/plans/:id
 * @access  Public
 */
const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate('trainer', 'name email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check if user is subscribed
    let isSubscribed = false;
    if (req.user) {
      const user = await User.findById(req.user._id);
      isSubscribed = user.purchasedPlans.some(
        (id) => id.toString() === plan._id.toString()
      );
    }

    // Return full details only if subscribed, otherwise preview
    if (isSubscribed) {
      res.status(200).json({
        success: true,
        data: {
          _id: plan._id,
          title: plan.title,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer,
          subscribersCount: plan.subscribers.length,
          isSubscribed: true,
          createdAt: plan.createdAt,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          _id: plan._id,
          title: plan.title,
          trainer: plan.trainer,
          price: plan.price,
          isSubscribed: false,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Update plan (Trainer only, own plans)
 * @route   PUT /api/plans/:id
 * @access  Private (Trainer)
 */
const updatePlan = async (req, res) => {
  try {
    let plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check if plan belongs to the trainer
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this plan',
      });
    }

    // Update plan
    plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('trainer', 'name email');

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete plan (Trainer only, own plans)
 * @route   DELETE /api/plans/:id
 * @access  Private (Trainer)
 */
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check if plan belongs to the trainer
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this plan',
      });
    }

    await Plan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Get trainer's plans
 * @route   GET /api/trainer/plans
 * @access  Private (Trainer)
 */
const getTrainerPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ trainer: req.user._id })
      .populate('trainer', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Subscribe to a plan
 * @route   POST /api/plans/:id/subscribe
 * @access  Private (User)
 */
const subscribeToPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already subscribed
    if (user.purchasedPlans.some((id) => id.toString() === plan._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'Already subscribed to this plan',
      });
    }

    // Simulate payment (in production, integrate payment gateway)
    // For now, just add to purchased plans

    // Add plan to user's purchasedPlans
    user.purchasedPlans.push(plan._id);
    await user.save();

    // Add user to plan's subscribers
    plan.subscribers.push(user._id);
    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to plan',
      data: {
        plan: {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  deletePlan,
  getTrainerPlans,
  subscribeToPlan,
};

