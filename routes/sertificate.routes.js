const Router = require('express')
const sertificateController = require('../controller/sertificate.controller');
const upload = require('../middleware/upload')

const sertificateRouter = new Router();

sertificateRouter.post('/sertificate', upload.single('file'), sertificateController.createSertificate)
sertificateRouter.get('/sertificate/:page', sertificateController.getPaginationSertificates)
sertificateRouter.get('/sertificate', sertificateController.getAllSertificates)
sertificateRouter.get('/sertificate-one/:id', sertificateController.getOneSertificate) 
sertificateRouter.get('/sertificate-search/:string', sertificateController.getSearchSertificates)
sertificateRouter.put('/sertificate', upload.single('file'), sertificateController.updateSertificate)
sertificateRouter.delete('/sertificate/:id', sertificateController.deleteSertificate)


module.exports = sertificateRouter;  