// App root file (Starting point)

//External imports
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

//Internal imports
const indexRouter = require('./api/routes/indexRouter');
const authRouter = require('./api/routes/authRouter');
const userRouter = require('./api/routes/userRouter');
const followRouter = require('./api/routes/followRouter');
const postRouter = require('./api/routes/postRouter');
const feedRouter = require('./api/routes/feedRouter');
const paymentRouter = require('./api/routes/paymentRouter');
const moderatorRouter = require('./api/routes/moderatorRouter');
const invalidRouter = require('./api/routes/invalidRouter');
const { requireAuth, checkUser } = require('./api/middlewares/authMiddleware');
const { init } = require('./socket');

// Dependant External imports
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

// Initializing Express App
const app = express();

// Connecting to mongoDb Database and starting the server
const dbURI = process.env.MONGO_DB_URI;
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log('Connected to the mongoDb Database.. ');
    const server = app.listen(process.env.PORT);
    const io = init(server);
    io.on('connection', () => {
      console.log('Client connected through socket');
    });
    console.log('Listening to port ', process.env.PORT);
  })
  .catch((err) => console.log(err));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routing
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', requireAuth, userRouter);
app.use('/follow', requireAuth, followRouter);
app.use('/posts', postRouter);
app.use('/feed', feedRouter);
app.use('/payment', paymentRouter);
app.use('/moderator', moderatorRouter);
app.use('/*', invalidRouter);

// Error Handling

// Catch 404 and forward to error handler - if all above routes fail
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

// Exporting the server app
module.exports = app;
