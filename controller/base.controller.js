const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');
const errorHandler = require('../utils/errorHandler')

class BaseController {
    async createKnowledge(req, res) {
        const {title, content} = req.body;
        const file = `${req.file.destination}${req.file.filename}`;
        if (!file) {
           return res.status(400).json({message: 'Пожалуйста, загрузите файл'})
        }
        try {
            const file_name = `${req.file.filename.split('-')[2]}`
            const newKnowledge = await db.query(`INSERT INTO knowledge (file, file_name, title, content) values ($1, $2, $3, $4) RETURNING *`, [file, file_name, title, content])
            res.json(newKnowledge.rows[0])
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
    }

    async getAllKnowledge(req, res) {
        try {   
            const knowledge = await db.query(`SELECT * FROM knowledge`)
            res.json(knowledge.rows)
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getPaginationKnowledge(req, res) {
        const page = req.params.page;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {   
            const knowledge = await db.query(`SELECT * FROM knowledge`)
            const result = knowledge.rows.slice(startIndex, endIndex)
            const totalPages = Math.ceil(knowledge.rows.length / limit)
            res.json({result: result, pages: totalPages})
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getSearchKnowledge(req, res) {
        const string = req.params.string;

        try {   
            const knowledge = await db.query(`SELECT * FROM knowledge`)
            // console.log(knowledge.rows)
            let result = [];
            knowledge.rows.forEach(item => {
                if (item.title.toLowerCase().includes(string.toLowerCase()) || item.content.toLowerCase().includes(string.toLowerCase())) {
                    result.push(item)
                }
            })
            res.json(result)
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getOneKnowledge(req, res) {
        const id = req.params.id
        try {
            const knowledge = await db.query(`SELECT * FROM knowledge where id = $1`, [id])
            res.json(knowledge.rows[0])
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    }

    async updateKnowledge(req, res) {  
        const {title, content, id} = req.body;
     
        const file = req.file; 
        
        if (!file) {
            try {
                const knowledge = await db.query(`UPDATE knowledge SET title = $1, content = $2 where id = $3 RETURNING *`, [ title, content, id])
                res.json(knowledge.rows[0])
            } catch(e) {
                return res.status(404).json({message: e.message})
            }
           
        } else {
            console.log(req.file.originalname)
            try {

                const knowledgeFile = await db.query(`SELECT * FROM knowledge where id = $1`, [id])
           
                fs.unlink(`${keys.del_url}${knowledgeFile.rows[0].file}`,function(err){
                    if(err) return console.log(err);
                    console.log('file deleted successfully');
                }); 
                const file = `${req.file.destination}${req.file.filename}`; 
                const file_name = `${req.file.filename.split('-')[2]}`
                const knowledge = await db.query(`UPDATE knowledge SET file = $1, file_name = $2, title = $3, content = $4 where id = $5 RETURNING *`, [file, file_name, title, content, id])
                res.json(knowledge.rows[0])
            } catch (e) {
                return res.status(404).json({message: e.message})
            }
        }
    } 

    async deleteKnowledge(req, res) {
        const {id} = req.body;
        try {
            const knowledgeFile = await db.query(`SELECT * FROM knowledge where id = $1`, [id])
           
            fs.unlink(`${keys.del_url}${knowledgeFile.rows[0].file}`,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
            }); 
            const knowledge = await db.query(`DELETE FROM knowledge where id = $1`, [id])
            return res.json(knowledge.rows[0])
        } catch (e) {
            return res.status(404).json({message: e.message})
        }
    }
}

module.exports = new BaseController();