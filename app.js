var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var adminsRouter = require('./routes/admin');
// var supervisorsRouter = require('./routes/supervisor');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("view options", { layout: "layouts/admin" });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/admin', adminsRouter);
// app.use('/supervisor', supervisorsRouter);

// Daftarkan helper
// helper cek role
hbs.registerHelper('eq', (a, b) => a === b);

// helper index + 1
hbs.registerHelper('inc', (a) => a + 1);

// helper untuk pagination
hbs.registerHelper('gt', (a, b) => a > b);
hbs.registerHelper('lt', (a, b) => a < b);
hbs.registerHelper('add', (a, b) => a + b);
hbs.registerHelper('subtract', (a, b) => a - b);

// helper untuk mengecek apakah suatu nilai ada di dalam array
hbs.registerHelper('includes', (array, value) => {
  return Array.isArray(array) && array.includes(value);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { 
    layout: 'layouts/error',
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
