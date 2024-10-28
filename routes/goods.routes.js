const Router = require('express');
const goodsController = require('../controller/goods.controller');
const upload = require('../middleware/upload');
const passport = require('passport');
const auth = require('../middleware/auth');

const goodsRouter = new Router();

goodsRouter.post(
    '/goods',
    upload.fields([
        { name: 'goodsPersonalImages', maxCount: 10 },
        { name: 'goodsIndustrialImages', maxCount: 10 },
        { name: 'imageUrl', maxCount: 1 },
        { name: 'pdfUrl', maxCount: 1 },
    ]),
    goodsController.createGood,
);
goodsRouter.get('/goods', goodsController.getAllGoods);
goodsRouter.get('/goods-pagination/:page', goodsController.getPaginationGoods);
goodsRouter.get('/goods-search/:string', goodsController.getSearchGoods);
goodsRouter.get('/goods/:id', goodsController.getOneGood);
goodsRouter.put(
    '/goods',
    upload.fields([
        { name: 'goodsPersonalImages', maxCount: 10 },
        { name: 'goodsIndustrialImages', maxCount: 10 },
        { name: 'imageUrl', maxCount: 1 },
        { name: 'pdfUrl', maxCount: 1 },
    ]),
    goodsController.updateGoods,
);
goodsRouter.delete('/goods/:id', goodsController.deleteGood);
goodsRouter.get('/goods-main/:main', goodsController.sortGoodsOnMainParameters);
goodsRouter.get(
    '/goods-parameters/:parameters',
    goodsController.sortGoodsOnAllParameters,
);

module.exports = goodsRouter;

// passport.authenticate('jwt', {session: false}),
