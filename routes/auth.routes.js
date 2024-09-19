const Router = require('express');
const {check} = require('express-validator');
const passport = require('passport')

const authController = require('../controller/auth.controller');

const authRouter = new Router();

authRouter.post('/login', authController.login)
authRouter.post('/registration' , [
    // passport.authenticate('jwt', {session: false}), // раскомментить при релизе
    check('email').trim().isEmail(),
    check('password').isLength({min: 6, max: 10})
], authController.register)
authRouter.post('/reset', authController.reset)
authRouter.get('/password/:token', authController.password)
authRouter.put('/password/:token', check('password').isLength({min: 6, max: 10}), authController.updateUser)
authRouter.delete('/delete', passport.authenticate('jwt', {session: false}), authController.deleteUser)

module.exports = authRouter;

