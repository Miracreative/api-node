const Router = require('express');
const afoamController = require('../controller/afoam.controler');
const passport = require('passport');
const auth = require('../middleware/auth');

const afoamRouter = new Router();

afoamRouter.get('/afoam', afoamController.getAllAfoam);
afoamRouter.get('/afoam/:id', afoamController.getOneAfoam);

module.exports = afoamRouter;

// passport.authenticate('jwt', {session: false}),
