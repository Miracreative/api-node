const Router = require('express')
const userRouter = new Router();
const userController = require('./../controller/user.controller')



userRouter.get('/users',  userController.getUsers)
userRouter.get('/users/:id',
    [passport.authenticate('jwt', {session: false}), ], 
    userController.getOneUser) // через слеш
userRouter.put('/users', userController.updateUser)
userRouter.delete('/users/:id', userController.deleteUser)

 

module.exports = userRouter;