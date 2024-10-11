const db = require('../db');

class SertificateController {
    async createSertificate(req, res) {
        try {
            const {type, title} = req.body;
            const imageSrc = `${req.file.destination}${req.file.filename}`;
            const newSertificate = await db.query(`INSERT INTO sertificates (imageSrc, type, title) values ($1, $2, $3) RETURNING *`, [imageSrc, type, title])
            res.json(newSertificate.rows[0])
        } catch(e) {
            return res.status(400).json({message: e.message})
        }
       
    }
    async getAllSertificates(req, res) {
        try {
            const sertificates = await db.query(`SELECT * FROM sertificates`) 
            res.json(sertificates.rows)
        } catch (e){
            return res.status(404).json({message: e.message})
        }
        
    }

    async getPaginationSertificates(req, res) {
        const page = req.params.page;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {   
            const sertificates = await db.query(`SELECT * FROM sertificates`)
            const result = sertificates.rows.slice(startIndex, endIndex)
            const totalPages = Math.ceil(sertificates.rows.length / limit)
            res.json({result: result, pages: totalPages})
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getSearchSertificates(req, res) {
        const string = req.params.string;
        try {   
            const sertificates = await db.query(`SELECT * FROM sertificates`)
            let result = [];
            sertificates.rows.forEach(item => {
                console.log(sertificates)
                if (item.title.toLowerCase().includes(string.toLowerCase())) {
                   
                    result.push(item)
                }
            })
           res.json(result)
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async deleteSertificate(req, res) {
        const {id} = req.body;
        try  {
            const sertificate = await db.query(`DELETE FROM sertificates where id = $1`, [id])
            res.json(sertificate.rows[0])
        }  catch (e) {
            return res.status(404).json({message: e.message})
        }
    }
}

module.exports = new SertificateController();