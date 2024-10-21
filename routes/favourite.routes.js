const Router = require('express')
const favouriteController = require('./../controller/favourite.controller');

const favouriteRouter = new Router();

favouriteRouter.post('/favourite', favouriteController.createFavourite)
favouriteRouter.get('/favourite', favouriteController.getFavouriteGoods) 
favouriteRouter.delete('/favourite/:id', favouriteController.deleteFavourite) 

module.exports = favouriteRouter;