const Router = require('express')
const baseController = require('../controller/base.controller');
const upload = require('../middleware/upload')
const passport = require('passport')
const auth = require('../middleware/auth')

const baseRouter = new Router();

baseRouter.post('/base', upload.single('file'), baseController.createKnowledge)
baseRouter.get('/base', baseController.getAllKnowledge)
baseRouter.get('/base/:id', baseController.getOneKnowledge) 
baseRouter.get('/base-admin/:page', baseController.getPaginationKnowledge)
baseRouter.get('/base-search/:string', baseController.getSearchKnowledge)
baseRouter.put('/base', upload.single('file'), baseController.updateKnowledge)
baseRouter.delete('/base', baseController.deleteKnowledge)


module.exports = baseRouter;  

// passport.authenticate('jwt', {session: false}),