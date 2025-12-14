const User = require('../models/User');

/**
 * @desc    Follow a trainer
 * @route   POST /api/trainers/:id/follow
 * @access  Private (User)
 */
const followTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const userId = req.user._id;

    // Check if trainer exists and is actually a trainer
    const trainer = await User.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    if (trainer.role !== 'trainer') {
      return res.status(400).json({
        success: false,
        message: 'User is not a trainer',
      });
    }

    // Prevent following yourself
    if (trainerId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself',
      });
    }

    const user = await User.findById(userId);

    // Check if already following
    if (user.followedTrainers.some((id) => id.toString() === trainerId)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this trainer',
      });
    }

    // Add trainer to followed list
    user.followedTrainers.push(trainerId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully followed trainer',
      data: {
        trainer: {
          _id: trainer._id,
          name: trainer.name,
          email: trainer.email,
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

/**
 * @desc    Unfollow a trainer
 * @route   POST /api/trainers/:id/unfollow
 * @access  Private (User)
 */
const unfollowTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Check if following
    const isFollowing = user.followedTrainers.some(
      (id) => id.toString() === trainerId
    );

    if (!isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'Not following this trainer',
      });
    }

    // Remove trainer from followed list
    user.followedTrainers = user.followedTrainers.filter(
      (id) => id.toString() !== trainerId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unfollowed trainer',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Get user's following list
 * @route   GET /api/users/following
 * @access  Private (User)
 */
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'followedTrainers',
      'name email role'
    );

    res.status(200).json({
      success: true,
      count: user.followedTrainers.length,
      data: user.followedTrainers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Get all trainers
 * @route   GET /api/trainers
 * @access  Public
 */
const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' })
      .select('name email role createdAt')
      .sort('-createdAt');

    // If user is authenticated, check which trainers they follow
    let followingIds = [];
    if (req.user && req.user.role === 'user') {
      const user = await User.findById(req.user._id);
      followingIds = user.followedTrainers.map((id) => id.toString());
    }

    const trainersWithFollowStatus = trainers.map((trainer) => ({
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      role: trainer.role,
      createdAt: trainer.createdAt,
      isFollowing: followingIds.includes(trainer._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: trainersWithFollowStatus.length,
      data: trainersWithFollowStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  followTrainer,
  unfollowTrainer,
  getFollowing,
  getTrainers,
};

