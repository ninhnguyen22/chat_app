const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: 'assets/images/avatar.png'
  },
  password: {
    type: String,
    required: true
  },
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Add avatar
   */
  addAvatar: function (avatar) {
    this.avatar = avatar;

    return this.save();
  },
};

UserSchema.methods.verifyPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
}


const User = mongoose.model('User', UserSchema);

module.exports = User;
