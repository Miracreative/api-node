const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');

class NewsController {
    async createNews(req, res) {
        const {title, descr, content} = req.body;
     
        const files = req.files;
        console.log(files)
        if (!files.length) {
            return res.status(400).json({message: 'Пожалуйста, загрузите картинки'})
        }

        let imagesSrc = [];
        files.map((file, index) => { 
            imagesSrc.push(`${file.destination}${file.filename}`)
        })
        try {
            const newNews = await db.query(`INSERT INTO news (imagesSrc, title, descr, content) values ($1, $2, $3, $4) RETURNING *`, [imagesSrc, title, descr, content])
            res.json(newNews.rows[0])
        } catch(e) {
            return res.status(400).json({message: e.message})
        }
         
    }

    async getAllNews(req, res) {
        try {
            const news = await db.query(`SELECT * FROM news`,)
            res.json(news.rows)
        } catch(e) {
            return res.json({message: e.message})
        }
        
    } 

    async getPaginationNews(req, res) {
        const page = req.params.page;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {   
            const news = await db.query(`SELECT * FROM news`)
            const result = news.rows.slice(startIndex, endIndex)
            const totalPages = Math.ceil(news.rows.length / limit)
            res.json({result: result, pages: totalPages})
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getSearchNews(req, res) {
        const string = req.params.string;
       
        try {   
            const news = await db.query(`SELECT * FROM news`)
            
            let result = [];
            news.rows.forEach(item => {
                console.log(news.rows[0].title.toLowerCase().includes(string.toLowerCase()))
                if (item.title.toLowerCase().includes(string.toLowerCase()) || item.content.toLowerCase().includes(string.toLowerCase()) || item.descr.toLowerCase().includes(string.toLowerCase())) {
                    result.push(item)
                }
            })
            res.json(result)
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getLastNews(req, res) {
        try {
            const news = await db.query(`SELECT * FROM news`,)
            res.json((news.rows.slice(news.rows.length-3, news.rows.length)))
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
    } 

    async getOneNews(req, res) {
        const id = req.params.id
        try {
            const news = await db.query(`SELECT * FROM news where id = $1`, [id])
      
            res.json(news.rows[0])
        } catch(e) {
            return res.status(400).json({message: e.message})
        }
    }

    async updateNews(req, res) { 
        const {title, descr, content, id} = req.body;
        
        const files = req.files;
        if (!files) {
            try {
                const news = await db.query(`UPDATE news SET  title = $1, descr = $2, content = $3 where id = $4 RETURNING *`, [ title, descr, content, id])
                res.json(news.rows[0])
            } catch(e) {
                return res.status(400).json({message: e.message})
            }
            
        } else {
            let imagesSrc = [];

            files.map((file, index) => {
                imagesSrc.push(`${file.destination}${file.filename}`)
            })
            try {
                const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [id])

                imageFiles.rows[0].imagesSrc.forEach(item => {
                    fs.unlink(`${keys.del_url}${item}`,function(err){
                        if(err) return console.log(err);
                        console.log('file deleted successfully');
                    }); 
                })
                // проверить удаление файлов

                const news = await db.query(`UPDATE news SET imagesSrc = $1, title = $2, descr = $3, content = $4 where id = $5 RETURNING *`, [imagesSrc, title, descr, content, id])
                res.json(news.rows[0])
            } catch(e) {
                return res.status(404).json({message: e.message})
            }
        }
    } 

    async deleteNews(req, res) {
        const id = req.params.id;

        const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [id])

        imageFiles.rows[0].imagesSrc.forEach(item => {
            fs.unlink(`${keys.del_url}${item}`,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
            }); 
        })

        try {
            const news = await db.query(`DELETE FROM news where id = $1`, [id])
            res.json(news.rows[0])
        } catch(e) {
            return res.status(400).json({message: e.message})
        }
        
    }
}

module.exports = new NewsController();