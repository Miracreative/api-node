const Router = require('express')
const companyController = require('../controller/company.controller');
const upload = require('../middleware/upload')
const companyRouter = new Router();

companyRouter.post('/company', upload.single('file'), companyController.createCompany)
companyRouter.get('/company',  companyController.getAllCompany)
companyRouter.put('/company', upload.single('file'), companyController.updateCompany)


module.exports = companyRouter;  