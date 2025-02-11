const Router = require('express')
const userRouter = new Router();
const userController = require('./../controller/user.controller')
const passport = require('passport')


userRouter.get('/users', 
    [passport.authenticate('jwt', {session: false}), ],
    userController.getUsers)
userRouter.get('/users/:id',
    // [passport.authenticate('jwt', {session: false}), ], 
    userController.getOneUser) // через слеш
userRouter.put('/users',
    // [passport.authenticate('jwt', {session: false}), ],
    userController.updateUser)
userRouter.delete('/users/:id', 
    // [passport.authenticate('jwt', {session: false}), ],
    userController.deleteUser)
module.exports = userRouter;