const db = require('../db');

class BaseController {
    async createKnowledge(req, res) {
        const {title, content} = req.body;
     
        const file = `${req.file.destination}${req.file.filename}`;
        if (!file) {
            res.status(400)
            throw new Error('Пожалуйста, загрузите файл')
        }
        const file_name = `${req.file.filename.split('-')[2]}`
        const newKnowledge = await db.query(`INSERT INTO knowledge (file, file_name, title, content) values ($1, $2, $3, $4) RETURNING *`, [file, file_name, title, content])
        res.json(newKnowledge.rows[0])
    }

    async getAllKnowledge(req, res) {
        try {   
            const knowledge = await db.query(`SELECT * FROM knowledge`,)
            res.json(knowledge.rows)
        } catch(e) {
            console.log(e)
        }
      
    } 

    async getOneKnowledge(req, res) {
        const id = req.params.id
        const knowledge = await db.query(`SELECT * FROM knowledge where id = $1`, [id])
      
        res.json(knowledge.rows[0])
    }

    async updateKnowledge(req, res) { 
        const {title, content, id} = req.body;
     
        const file = req.file; 
        if (!file) {
            const knowledge = await db.query(`UPDATE knowledge SET title = $1, content = $2 where id = $3 RETURNING *`, [ title, content, id])
            res.json(knowledge.rows[0])
        } else {
            const file = `${req.file.destination}${req.file.filename}`; 
            const file_name = `${req.file.filename.split('-')[2]}`
            const knowledge = await db.query(`UPDATE knowledge SET file = $1, file_name = $2, title = $3, content = $4 where id = $5 RETURNING *`, [file, file_name, title, content, id])
            res.json(knowledge.rows[0])
        }
    } 

    async deleteKnowledge(req, res) {
        const {id} = req.body;
        const knowledge = await db.query(`DELETE FROM knowledge where id = $1`, [id])
        res.json(knowledge.rows[0])
    }
}

module.exports = new BaseController();