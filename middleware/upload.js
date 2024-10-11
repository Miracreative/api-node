const multer = require('multer');
const moment = require('moment');


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        console.log(Buffer.from(file.originalname, 'latin1').toString('utf8'))
        cb(null, `${date}-${Buffer.from(file.originalname, 'latin1').toString('utf8')}`)
    }

})
 
const fileFilter = (req, res, cb) => {
    cb(null, true)
}

const limits = {
    fileSize: 1024 * 1024 * 5
}

module.exports = multer({
    storage,
    fileFilter,
    // limits
})