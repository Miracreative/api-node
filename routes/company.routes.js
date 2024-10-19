const Router = require('express')
const companyController = require('../controller/company.controller');
const companyRouter = new Router();

companyRouter.post('/company',  companyController.createCompany)
companyRouter.get('/company', companyController.getAllCompany)
companyRouter.put('/company', companyController.updateCompany)


module.exports = companyRouter;  