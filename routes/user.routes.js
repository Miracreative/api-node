const Router = require('express')
const userRouter = new Router();
const userController = require('./../controller/user.controller')
const passport = require('passport')


userRouter.get('/users',  userController.getUsers)
userRouter.get('/users/:id', userController.getOneUser) 
userRouter.put('/users',[passport.authenticate('jwt', {session: false}), ],  userController.updateUser)
userRouter.delete('/users/:id', [passport.authenticate('jwt', {session: false}), ], userController.deleteUser)

 

module.exports = userRouter;