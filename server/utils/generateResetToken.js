const crypto = require('crypto');

/**
 * Generate reset password token
 * @returns {String} Reset token
 */
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  return resetToken;
};

/**
 * Hash reset token
 * @param {String} token - Reset token
 * @returns {String} Hashed token
 */
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateResetToken,
  hashResetToken,
};

