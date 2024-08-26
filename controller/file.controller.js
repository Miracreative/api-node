const db = require('../db');

class FileController {
    async createFile(req, res) {
        const {title, content, user_id} = req.body;

        const newPost = await db.query(`INSERT INTO post (title, content, user_id) values ($1, $2, $3) RETURNING *`, [title, content, user_id])
        console.log(title, content);
        res.json(newPost.rows[0])
    }
    async getFilesByUser(req, res) {
        const id = req.query.id;
        const posts = await db.query(`SELECT * FROM post where user_id = $1`, [id])
        res.json(posts.rows)
    }
}

module.exports = new FileController();