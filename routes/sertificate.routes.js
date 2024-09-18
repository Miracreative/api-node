const Router = require('express')
const sertificateController = require('../controller/sertificate.controller');
const upload = require('../middleware/upload')

const sertificateRouter = new Router();

sertificateRouter.post('/sertificate', upload.single('imageSrc'), sertificateController.createSertificate)
sertificateRouter.get('/sertificate', sertificateController.getAllSertificates)
sertificateRouter.delete('/sertificate', sertificateController.deleteSertificate)


module.exports = sertificateRouter;