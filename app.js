var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var okta = require('@okta/okta-sdk-nodejs');
var ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;

//const auth = require("./auth");
//const middleware = require("./middleware");

const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "assets")));

var oktaClient = new okta.Client({
  orgUrl: '{https://dev-912173.okta.com}',
  token: '{00MLeIKtlDehK7XDvBHVX3FlteIZCJH8aaAS3SM8pp}'
});

const oidc = new ExpressOIDC({
  issuer: "https://dev-912173.okta.com/oauth2/default",
  client_id: '0oahwz96t6lGCya5B356',
  client_secret: 'PnEQDX5Fb1sktCIh4sw21Kr8XEO3M7mBOcwO0lxP',
  redirect_url: 'http://localhost:3000/users/callback',
  scope: 'openid profile',
  routes: {
    login: {
      path: '/users/login',
    },
    callback: {
      path: 'users/callback',
      defaultRedirect: '/dashboard'
    }
  }
});



app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'B@G!rWc7RGm3^UmAEVL&g5svnIdu#!$qZzwza&cedQW%RpjFO&7F8hHi6dodwgZY0a7T6ZT2Z02fT8yzr80&g@e&vpLHUYUojwjr',
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);
app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }
  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
};



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
