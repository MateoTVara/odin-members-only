const { body, validationResult, matchedData } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const users = require('../db/queries/usersQueries');

const validateUser = [
  body('first_name').trim()
    .isAlpha().withMessage('First name must contain only letters')
    .isLength({ min: 1, max: 255 }).withMessage('First name must be between 1 and 255 characters'),
  body('last_name').trim()
    .isAlpha().withMessage('Last name must contain only letters')
    .isLength({ min: 1, max: 255 }).withMessage('Last name must be between 1 and 255 characters'),
  body('username').trim()
    .isLength({ min: 1, max: 255 }).withMessage('Username must be between 1 and 255 characters'),
  body('password').trim()
    .isLength({ min: 1, max: 255 }).withMessage('Password must be between 1 and 255 characters'),
  body('confirm_password').trim()
    .isLength({ min: 1, max: 255 }).withMessage('Confirm password must be between 1 and 255 characters')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
]

const getIndex = async (req, res) => {
  try {
    req.session.views = (req.session.views ?? 0) + 1;

    res.render('pages/index', {
      title: 'Home Page',
      views: req.session.views,
      user: req.user,
    });
  } catch (error) {
    console.error('Error fetching index data:', error);
  }
}

const getAuth = async (req, res) => {
  try {
    res.render('pages/auth', {
      title: 'Authentication',
      errors: [],
      data: {},
    });
  } catch (error) {
    console.error('Error fetching login data:', error);
  }
}

const postSignUp = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/auth', {
        title: 'Authentication',
        errors: errors.array(),
        data: req.body,
      });
    }

    const receivedUser = matchedData(req);

    try {
      const userExists = await users.getUserByUsername(receivedUser.username) ? true : false;
      
      if (userExists) {
        return res.status(400).render('pages/auth', {
          title: 'Authentication',
          errors: [{ msg: 'Username already taken' }],
          data: receivedUser,
        });
      }

      const hashedPassword = await bcrypt.hash(receivedUser.password, 10);

      const newUser = await users.insert({
        ...receivedUser,
        password: hashedPassword,
      });

      req.login(newUser, (err) => {
        if (err) return next(err);
        return res.redirect('/');
      })
    } catch (error) {
      next(error)
    }
  }
]

const postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth',
});

const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect('/');
}

module.exports = {
  getIndex,
  getAuth,
  postSignUp,
  postLogin,
  getLogout,
}