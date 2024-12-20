const Router = require('express');
const newsController = require('../controller/news.controller');
const upload = require('../middleware/upload');
const passport = require('passport');
const auth = require('../middleware/auth');

// upload.fields([
//     { name: 'files', maxCount: 10 },
//     { name: 'main', maxCount: 1 },
// ]),

const newsRouter = new Router();

newsRouter.post(
    '/news',
    upload.fields([
    { name: 'carousel', maxCount: 10 },
    { name: 'main', maxCount: 1 },
    ]), 
    newsController.createNews);
newsRouter.get(
    '/news',
    // [passport.authenticate('jwt', {session: false})],
    newsController.getAllNews
);
newsRouter.get(
    '/news-last',
    //  auth,
    newsController.getLastNews
);
newsRouter.get('/news-pagination/:page', newsController.getPaginationNews);
newsRouter.get('/news-search/:string', newsController.getSearchNews);
newsRouter.get('/news/:id', newsController.getOneNews);
newsRouter.put('/news',    upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'mainimage', maxCount: 1 },
    ]),  newsController.updateNews);
newsRouter.delete('/news/:id', newsController.deleteNews);

module.exports = newsRouter;

// passport.authenticate('jwt', {session: false}),
