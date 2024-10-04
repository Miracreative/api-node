const db = require('../db');
const errorHandler = require('../utils/errorHandler')

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
            errorHandler(res, e)
        }
         
    }
    async getAllNews(req, res) {
        try {
            const news = await db.query(`SELECT * FROM news`,)
            res.json(news.rows)
        } catch(e) {
            errorHandler(res, e)
        }
        
    
    } 
    async getLastNews(req, res) {
        try {
            const news = await db.query(`SELECT * FROM news`,)
            res.json((news.rows.slice(news.rows.length-3, news.rows.length)))
        } catch(e) {
            errorHandler(res, e)
        }
        
    
    } 
    async getOneNews(req, res) {
        const id = req.params.id
        try {
            const news = await db.query(`SELECT * FROM news where id = $1`, [id])
      
            res.json(news.rows[0])
        } catch(e) {
            errorHandler(res, e)
        }
        
    }
    async updateNews(req, res) { 
        const {title, descr, content, id} = req.body;
     
        const files = req.files;
        if (!files) {
            const news = await db.query(`UPDATE news SET  title = $1, descr = $2, content = $3 where id = $4 RETURNING *`, [ title, descr, content, id])
            res.json(news.rows[0])
        } else {
            let imagesSrc = [];

            files.map((file, index) => {
                imagesSrc.push(`${file.destination}${file.filename}`)
            })
            try {
                const news = await db.query(`UPDATE news SET imagesSrc = $1, title = $2, descr = $3, content = $4 where id = $5 RETURNING *`, [imagesSrc, title, descr, content, id])
                res.json(news.rows[0])
            } catch(e) {
                errorHandler(res, e)
            }
           
        }
    } 
    async deleteNews(req, res) {
        const {id} = req.body;
        try {
            const news = await db.query(`DELETE FROM news where id = $1`, [id])
            res.json(news.rows[0])
        } catch(e) {
            errorHandler(res, e)
        }
        
    }
}

module.exports = new NewsController();