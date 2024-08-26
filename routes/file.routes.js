const Router = require('express')
const fileController = require('./../controller/file.controller')

const fileRouter = new Router();

fileRouter.post('/file/', fileController.createFile)
fileRouter.get('/file/', postController.getFilesesByUser)

module.exports = fileRouter;