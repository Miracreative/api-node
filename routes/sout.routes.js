const Router = require('express');
const soutController = require('../controller/sout.controller');
const upload = require('../middleware/upload');
const passport = require('passport');
const auth = require('../middleware/auth');

const soutRouter = new Router();

soutRouter.post('/sout', upload.single('file'), soutController.createSout);
soutRouter.get('/sout', soutController.getAllSouts);
soutRouter.get('/sout/:id', soutController.getOneSout);
soutRouter.get('/sout-admin/:page', soutController.getPaginationSouts);
soutRouter.get('/sout-search/:string', soutController.getSearchSout);
soutRouter.put('/sout', upload.single('file'), soutController.updateSout);
soutRouter.delete('/sout/:id', soutController.deleteSout);

module.exports = soutRouter;

// passport.authenticate('jwt', {session: false}),
