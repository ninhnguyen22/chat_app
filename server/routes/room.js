const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const ObjectId = require('mongoose').Types.ObjectId;

/* Get all room */
router.get('',
  (req, res, next) => {
    const query = Room
      .find({}, {messages: {$slice: -1}})
      .populate('messages.user', 'name avatar');

    query.exec(function (err, rooms) {
      if (err) return next(err);
      res.json({
        rooms
      })
    });
  }
);

/* Create new room */
router.post('/store',
  (req, res, next) => {
    const name = req.body.name;
    const user = req.user;

    const room = new Room({name});
    try {
      room.addMessage(user, {
        msgType: 'text',
        text: 'Room created by ' + user.name,
        user: user._id
      });
      res.json({
        'room': room
      });
    } catch (err) {
      return {error: err.message};
    }
  }
);

/* Create new room */
router.get('/messages/:roomId',
  (req, res, next) => {
    const roomId = req.params.roomId;
    const query = Room
      .findById(new ObjectId(roomId))
      .populate('messages.user', 'name avatar');

    query.exec(function (err, room) {
      if (err) return next(err);
      res.json({
        'messages': room.messages
      })
    });
  }
);

module.exports = router;
