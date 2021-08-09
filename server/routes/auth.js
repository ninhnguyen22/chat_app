const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const upload = require('../services/storage');

/* POST register */
router.post(
  '/register',
  [
    upload.single('avatar'),
    passport.authenticate('register', {session: false})
  ],
  async (req, res, next) => {
    if (req.user) {
      const user = req.user;
      if (req.file) {
        user.addAvatar('assets/images/' + req.file.filename);
      }
      return res.json({
        message: 'Register successful',
        status: true
      });
    }
    return res.json({
      message: 'Register fail',
      status: false
    });
  }
);

/* POST login. */
router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err) {
            return next(err);
          }
          if (!user) {
            const error = new Error(info.message);
            error.status = 401;
            return next(error);
          }

          req.login(
            user,
            {session: false},
            async (error) => {
              if (error) return next(error);

              const body = {_id: user._id, name: user.name};
              const token = jwt.sign({user: body}, 'TOKEN_SECRET');

              return res.json({token, name: user.name, avatar: user.avatar, _id: user._id});
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

module.exports = router;
