const Router = require('express');
const passport = require('passport')

const authController = require('../controller/auth.controller');

const authRouter = new Router();

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.get('/refresh/:refresh_token', authController.refresh)
authRouter.post('/registration', authController.register)
authRouter.post('/reset', authController.reset)
authRouter.get('/password/:token', authController.password)
authRouter.put('/password/:token', authController.updateUser)

module.exports = authRouter;

 