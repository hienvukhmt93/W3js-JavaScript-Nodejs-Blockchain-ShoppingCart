var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');//
var mongoose = require('mongoose'); //
var session = require('express-session');
var passport = require('passport');////
var flash = require('connect-flash');//
var validator = require('express-validator');//
var MongoStore = require('connect-mongo')(session);
var upload = require('express-fileupload');
var bodyParser = require('body-parser');





var routes = require('./routes/index');//
var useRouter = require('./routes/user');//
var useAdminRouter = require('./routes/admin');

var app = express();

mongoose.connect('mongodb://localhost:27017/shopping');//
// view engine setup
app.engine('.hbs',expressHbs({ defaultLayout: 'layout', extname: '.hbs',
      helpers: './public/helpers/helpers',
}));//

app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(upload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());//
app.use(session({
  secret: 'My', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180 *60 * 1000}
}));//
app.use(validator({
  customValidators: {
    isAddressCustom (add_owner, add_sesion) {
      return add_owner ==  add_sesion ? true: false;
    }
  } 
}));
app.use(flash());//
app.use(passport.initialize());//
app.use(passport.session());//
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '200mb',
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use( function(req, res, next) {
  res.locals.Login = req.isAuthenticated();
  res.locals.session = req.session;
  if(req.session.email == 'address1@gmail.com') {
    res.locals.admin = req.session.email;
  }

  res.locals.email = req.session.email;
  if(req.session.balances == null) {
    res.locals.balances =  req.session.balances;
  } else {
    res.locals.balances = req.session.balances;
  }
  next();
});

app.use( function(req, res, next) {
  res.locals.notLogin = req.isUnauthenticated();
  next();
});
require('./config/passport');//

app.use('/', routes);//
app.use('/user',useRouter);//
app.use('/admin', useAdminRouter);


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
  res.render('error');
});


module.exports = app;
