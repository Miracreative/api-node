const db = require('../db');

class NewsController {
    async createNews(req, res) {
        const {title, descr, content} = req.body;
     
        const files = req.files;
        if (!files) {
            res.status(400)
            throw new Error('Пожалуйста, загрузите картинки')
        }

        let imagesSrc = [];

        files.map((file, index) => {
            imagesSrc.push(`${file.destination}${file.filename}`)
        })

        const newNews = await db.query(`INSERT INTO news (imagesSrc, title, descr, content) values ($1, $2, $3, $4) RETURNING *`, [imagesSrc, title, descr, content])
        res.json(newNews.rows[0])
    }
    async getAllNews(req, res) {
        const news = await db.query(`SELECT * FROM news`,)
        res.json(news.rows)
    
    } 
    async getOneNews(req, res) {
        const id = req.params.id
        const news = await db.query(`SELECT * FROM news where id = $1`, [id])
      
        res.json(news.rows[0])
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

            const news = await db.query(`UPDATE news SET imagesSrc = $1, title = $2, descr = $3, content = $4 where id = $5 RETURNING *`, [imagesSrc, title, descr, content, id])
            res.json(news.rows[0])
        }
    } 
    async deleteNews(req, res) {
        const {id} = req.body;
        const news = await db.query(`DELETE FROM news where id = $1`, [id])
        res.json(news.rows[0])
    }
}

module.exports = new NewsController();