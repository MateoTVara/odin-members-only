const { Router } = require('express');
const indexController = require('../controllers/indexController');
const indexRouter = Router();
const { authNeeded } = require('../middlewares/auth');
const { isMember } = require('../middlewares/flags');

indexRouter.get('/', isMember, indexController.getIndex);
indexRouter.get('/auth', indexController.getAuth);
indexRouter.post('/sign-up', indexController.postSignUp);
indexRouter.post('/login', indexController.postLogin);
indexRouter.get('/logout', indexController.getLogout);
indexRouter.get('/new-message', authNeeded, indexController.getNewMessage);
indexRouter.get('/join', authNeeded, indexController.getJoin);
indexRouter.post('/join', authNeeded, indexController.postJoin);

module.exports = indexRouter;