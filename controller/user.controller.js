const db = require('../db');

class UserController {
    async getUsers(req, res) {
        const users = await db.query(`SELECT * FROM users`)
        res.json(users.rows)
    } 
    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query(`SELECT * FROM users where id = $1`, [id])
        res.json(user.rows[0])
    }
    async updateUser(req, res) { 
        const {name, surname, id} = req.body
        const user = await db.query(`UPDATE person SET name = $1, surname = $2 where id = $3 RETURNING *`, [name, surname, id])
        res.json(user.rows[0])
    } 
    async deleteUser(req, res) {
        const {id} = req.body
        const user = await db.query(`DELETE FROM users where id = $1`, [id])
        res.json(user.rows[0])
    }
}

module.exports = new UserController();