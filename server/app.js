const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');

const app = express();

/* ENV */
require('dotenv').config();

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// Model
const User = require('./models/user');
const Room = require('./models/room');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*',
}));

// Router
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const roomRoute = require('./routes/room');

require('./auth/auth');
app.use('/', authRoute);
app.use('/rooms', passport.authenticate('jwt', {session: false}), roomRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);

// Socket io Connect
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(passport.initialize()));
io.use(wrap(passport.authenticate('jwt', {session: false})));

io.on('connect',
  (socket) => {
    /* Join room */
    socket.on('join', ({roomId, isCreate}, callback) => {
      const query = Room
        .findById(new ObjectId(roomId))
        .populate('messages.user', 'name avatar');

      query.exec(function (err, room) {
        if (err) return next(err);
        if (room) {
          socket.join(roomId);
          if (isCreate) {
            socket.broadcast.emit(`rooms`, room);
          }
        }
      });
    });
    /* Send message to room */
    socket.on('sendMessage', ({roomId, message}, callback) => {
      const userRequest = socket.request.user;
      User.findById(new ObjectId(userRequest._id), (err, user) => {
        if (err) return callback(err);
        if (user) {
          Room.findById(new ObjectId(roomId), (err, room) => {
            if (err) return callback(err);
            if (room) {
              /* Add message */
              room.addMessage(user, {
                msgType: 'text',
                text: message,
                user: user._id
              });

              /* Emit message */
              const messageEmit = {
                _id: user._id,
                avatar: user.avatar,
                type: 'text',
                text: message,
                date: new Date()
              }
              io.to(roomId).emit(`message:${roomId}`, messageEmit);
            }
          });
        }
      })
    });

    socket.on('disconnect', () => {

    })
  });

/* App run */
function listen() {
  server.listen(process.env.PORT || 5000, () => console.log(`App listening on port 5000`));
}

/* Mongoose Connect */
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const dbName = process.env.DB_NAME || 'chat_app';
const dbConnectUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`;
mongoose.connect(dbConnectUrl, {
  keepAlive: 1,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => listen());

// Handle errors.
app.use(function (err, req, res, next) {
  console.log('err', err)
  const msg = err.message || 'Internal Server Error';
  res.status(err.status || 500).json({error: msg});
});

module.exports = app;
