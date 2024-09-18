const db = require('../db');

class SertificateController {
    async createSertificate(req, res) {
        const imageSrc = `${req.file.destination}${req.file.filename}`;
        const newSertificate = await db.query(`INSERT INTO sertificates (imageSrc) values ($1) RETURNING *`, [imageSrc])
        res.json(newSertificate.rows[0])
        console.log(req.file.path)
    }
    async getAllSertificates(req, res) {
        const sertificates = await db.query(`SELECT * FROM sertificates`)
        res.json(sertificates.rows)
    }
    async deleteSertificate(req, res) {
        const {id} = req.body;
        const sertificate = await db.query(`DELETE FROM sertificates where id = $1`, [id])
        res.json(sertificate.rows[0])
    }
}

module.exports = new SertificateController();