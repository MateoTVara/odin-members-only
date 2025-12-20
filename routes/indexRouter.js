const { Router } = require('express');
const indexController = require('../controllers/indexController');
const indexRouter = Router();

indexRouter.get('/', indexController.getIndex);
indexRouter.get('/auth', indexController.getAuth);
indexRouter.post('/sign-up', indexController.postSignUp);
indexRouter.post('/login', indexController.postLogin);
indexRouter.get('/logout', indexController.getLogout);

module.exports = indexRouter;