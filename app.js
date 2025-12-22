const { format } = require('date-fns');
const { env } = require('node:process');
const express = require('express');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const expressLayouts = require('express-ejs-layouts');
const pool = require('./db/pool');
const users = require('./db/queries/usersQueries');

require('dotenv').config();

const { SESSION_SECRET, PORT } = env;

const app = express();

app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/base');

app.use(expressSession({
  store: new pgSession({
    pool,
    tableName: 'user_sessions',
  }),
  secret: SESSION_SECRET,
  resave: false,
  cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 },
  saveUninitialized: true,
}));
app.use(passport.session());

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.format = format;
  res.locals.user = req.user;
  res.locals.errors = req.session.errors || [];
  delete req.session.errors;
  next();
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await users.getUserByUsername(username);

      if (!user) return done(null, false, { message: 'Incorrect username' });

      const match = await bcrypt.compare(password, user.password);
      
      return match ? done(null, user) : done(null, false, { message: 'Incorrect password' });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.getUserById(id);
    done(null, user); 
  } catch (error) {
    done(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

const indexRouter = require('./routes/indexRouter');
app.use('/', indexRouter);

const messagesRouter = require('./routes/messagesRouter');
app.use('/messages', messagesRouter);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
})