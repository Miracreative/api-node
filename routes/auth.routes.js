const Router = require('express');
const passport = require('passport')

const authController = require('../controller/auth.controller');

const authRouter = new Router();

authRouter.post('/login', authController.login)
authRouter.post('/registration' , 
    // [
    // passport.authenticate('jwt', {session: false}), // раскомментить при релизе
// ], 
authController.register)
authRouter.post('/reset', authController.reset)
authRouter.get('/password/:token', authController.password)
authRouter.put('/password/:token', 
    // check('password').isLength({min: 6, max: 10}), 
    authController.updateUser)

module.exports = authRouter;

 