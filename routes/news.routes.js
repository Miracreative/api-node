const Router = require('express')
const newsController = require('../controller/news.controller');
const upload = require('../middleware/upload')
const passport = require('passport')
const auth = require('../middleware/auth')

const newsRouter = new Router();

newsRouter.post('/news', upload.array('imagesSrc', 10), newsController.createNews)
newsRouter.get('/news', [passport.authenticate('jwt', {session: false})], newsController.getAllNews)
newsRouter.get('/news-last', newsController.getLastNews)
newsRouter.get('/news/:id', newsController.getOneNews) 
newsRouter.put('/news', newsController.updateNews)
newsRouter.delete('/news', newsController.deleteNews)


module.exports = newsRouter;  

// passport.authenticate('jwt', {session: false}),