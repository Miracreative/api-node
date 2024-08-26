const Router = require('express')
const userRouter = new Router();
const userController = require('./../controller/user.controller')



userRouter.post('/user', userController.createUser)
userRouter.get('/user', userController.getUsers)
userRouter.get('/user/:id', userController.getOneUser)
userRouter.put('/user/', userController.updateUser)
userRouter.delete('/user/:id', userController.deleteUser)



module.exports = userRouter;