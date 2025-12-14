const mongoose = require('mongoose');

/**
 * Plan Schema
 * Created by trainers, subscribed to by users
 */
const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a plan title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a plan description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a plan price'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide plan duration in days'],
      min: [1, 'Duration must be at least 1 day'],
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);

