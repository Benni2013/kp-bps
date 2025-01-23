const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const adminRouter = require('./admin');

/* GET Landing Page . */
router.get('/', function(req, res, next) {
  res.render('index', { layout: "index" });
});

// Router untuk auth
router.use('/auth', authRouter);

// Router untuk user
router.use('/users', usersRouter);

// Router untuk admin
router.use('/admin', adminRouter);

module.exports = router;
