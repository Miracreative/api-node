const passport = require('passport')
const Router = require('express')
const companyController = require('../controller/company.controller');
const upload = require('../middleware/upload')
const companyRouter = new Router();

companyRouter.post('/company', 
    [passport.authenticate('jwt', {session: false}), upload.single('file')],
    companyController.createCompany)
companyRouter.get('/company',  companyController.getAllCompany)
companyRouter.put('/company', 
    [passport.authenticate('jwt', {session: false}), upload.single('file')], companyController.updateCompany)
companyRouter.delete('/company/:id', 
    [passport.authenticate('jwt', {session: false})],
    companyController.deleteCompany)

module.exports = companyRouter;   