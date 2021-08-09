const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 400,
    default: ''
  },
  messages: [
    {
      msgType: {type: String, default: 'text'},
      text: {type: String, default: ''},
      data: {type: Object, default: {}},
      date: {type: Date, default: Date.now()},
      user: {type: Schema.ObjectId, ref: 'User'}
    }
  ],
  users: [
    {
      user: {type: Schema.ObjectId, ref: 'User'},
      createdAt: {type: Date, default: Date.now}
    }
  ]
});

/**
 * Methods
 */
RoomSchema.methods = {
  /**
   * Add user
   *
   * @param {User} userInput
   */
  addUser: function (userInput) {
    if (!this.users.find(user => user._id === userInput._id)) {
      this.users.push({
        user: userInput._id
      });
    }

    return this.save();
  },

  /**
   * Add message
   *
   * @param {User} user
   * @param message
   */
  addMessage: function (user, message) {
    this.messages.push({
      msgType: message.type,
      text: message.text,
      data: message.data,
      date: message.date,
      user: user._id
    });

    return this.save();
  },
};

/**
 * Statics
 */

RoomSchema.statics = {

  /**
   * Get all room
   *
   * @param {Object} options
   */
  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({createdAt: -1})
      .limit(limit)
      .skip(limit * page)
      .exec();
  },

  /**
   * Get one
   */
  create: function (name, user) {
    const self = this;
    self.name = name;
    self.users = [user];
    return self.save();
  },

  /**
   * Get users
   */
  getUsers: function () {
    return this.users;
  },


};
const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
