const Router = require('express')
const postController = require('./../controller/post.controller');

const postRouter = new Router();

postRouter.post('/post/', postController.createPost)
postRouter.get('/post/', postController.getPostsByUser) //через квери-параметр

module.exports = postRouter;