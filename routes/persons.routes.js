const Router = require('express')
const personController = require('../controller/persons.controller');
const upload = require('../middleware/upload')

const personRouter = new Router();

personRouter.post('/person', upload.single('file'), personController.createPerson)
personRouter.get('/person/:page', personController.getPaginationPersons)
personRouter.get('/person', personController.getAllPersons)
personRouter.get('/person-one/:id', personController.getOnePerson) 
personRouter.get('/person-search/:string', personController.getSearchPersons)
personRouter.put('/person', upload.single('file'), personController.updatePerson)
personRouter.delete('/person/:id', personController.deletePerson)


module.exports = personRouter;  