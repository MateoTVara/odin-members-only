const { env } = require('node:process');
const { body, validationResult, matchedData } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const users = require('../db/queries/usersQueries');
const messages = require('../db/queries/messagesQueries');

require('dotenv').config();

const { MEMBER_PASSCODE, ADMIN_PASSCODE } = env;

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
];

const validatePasscode = [
  body('passcode').trim()
    .isLength({ min: 1 }).withMessage('Passcode is required')
    .isLength({ max: 20 }).withMessage('Passcode must be less than 20 characters')
];

const getIndex = async (req, res, next) => {
  try {
    req.session.views = (req.session.views ?? 0) + 1;
    const msgs = req.isMember ? await messages.getAllWithAuthorsNames() : await messages.getAll();

    res.render('pages/index', {
      title: 'Home Page',
      views: req.session.views,
      msgs,
    });
  } catch (error) {
    next(error);
  }
}

const getAuth = async (req, res, next) => {
  try {
    res.render('pages/auth', {
      title: 'Authentication',
    });
  } catch (error) {
    next(error);
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
        data: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          signup_username: req.body.username,
        },
      });
    }

    const data = matchedData(req);

    try {
      const userExists = await users.getUserByUsername(data.username) ? true : false;
      
      if (userExists) {
        return res.status(400).render('pages/auth', {
          title: 'Authentication',
          errors: [{ msg: 'Username already taken' }],
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            signup_username: data.username,
          },
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await users.insert({
        ...data,
        password: hashedPassword,
      });

      req.login(newUser, (err) => {
        if (err) return next(err);
        return res.redirect('/');
      })
    } catch (error) {
      next(error);
    }
  }
]

const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).render('pages/auth', {
        title: 'Authentication',
        errors: [{ msg: info && info.message ? info.message : 'Login failed' }],
        data: { login_username: req.body.username },
      });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
};

const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect('/');
}

const getNewMessage = (req, res, next) => {
  try {
    res.render('pages/new-msg', {
      title: 'New Message',
    });
  } catch (error) {
    next(error);
  }
}

const getJoin = (req, res, next) => {
  try {
    res.render('pages/join', {
      title: 'Join The Club!',
    })
  } catch (error) {
    next(error);
  }
}

const postJoin = [
  validatePasscode,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/join', {
        title: 'New Message',
        errors: errors.array(),
      });
    }
    
    const { passcode } = matchedData(req)

    try {
      const userId = req.user.id;
      
      if (![MEMBER_PASSCODE, ADMIN_PASSCODE].includes(passcode)) {
        return res.status(400).render('pages/join', {
          title: 'New Message',
          errors: [{ msg: 'Wrong passcode' }],
        });
      }
      
      let user;
      if (passcode === MEMBER_PASSCODE) {
        await users.makeMember(userId);
      } else if (passcode === ADMIN_PASSCODE) {
        await users.makeAdmin(userId);
      }

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
]

module.exports = {
  getIndex,
  getAuth,
  postSignUp,
  postLogin,
  getLogout,
  getNewMessage,
  getJoin,
  postJoin,
}