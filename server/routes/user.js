const express = require('express');
const router = express.Router();

router.get(
  '/profile',
  (req, res, next) => {
    res.json({
      status: true,
      user: req.user,
    })
  }
);

module.exports = router;
