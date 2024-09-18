const Router = require('express')
const userRouter = new Router();
const userController = require('./../controller/user.controller')



userRouter.get('/user', userController.getUsers)
userRouter.get('/user/:id', userController.getOneUser) // через слеш
userRouter.put('/user/', userController.updateUser)
userRouter.delete('/user', userController.deleteUser)

 

module.exports = userRouter;