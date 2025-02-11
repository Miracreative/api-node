const bcrypt = require('bcryptjs')
const mailer = require('../utils/nodemailer')
const db = require('../db');

class UserController {
    async getUsers(req, res) {
        try {
            const users = await db.query(`SELECT * FROM users`)
            console.log(JSON.stringify(users))
            res.json(users.rows)
        } catch (err) {
            return res.status(401).json({message: 'Что-то пошло не так'})
        }
        
    } 

    async getOneUser(req, res) {
        const id = req.params.id
        try {
            const user = await db.query(`SELECT * FROM users where id = $1`, [id])
            res.json(user.rows[0])
        } catch {
            return res.status(404).json({message: 'Что-то пошло не так'})
        }
    }

    async updateUser(req, res) {
 
        const {id, name, email, role} = req.body.data.admin;
            console.log(id, name, email, role)

        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.data.admin.password, salt)
        const candidate = await db.query(`SELECT * FROM users WHERE id = $1::int`, [id]);
        if(candidate.rowCount == 0) {
            
            res.status(409).json({message: 'Пользователя нет'})
        } else {
            try {
                const updateUser = await db.query(`UPDATE users SET name = $1, email = $2, password = $3, role = $4 where id = $5 RETURNING *`, [name, email, password, role, id])
                
                res.status(201).json(updateUser.rows[0])

                const message = {
                    to: email,
                    subject: 'Ваши новые данные в качестве администратора',
                    html: `
                        <h1>Ваши новые данные:</h1>
                        <p>имя: <b>${name}</b>,</p>
                        <p>login: <b>${email}</b>,</p>
                        <p>пароль: <b>${req.body.data.admin.password}</b></p>

                        <i>Данное письмо не требует ответа</i>
                    `
                }

                mailer(message)
            } catch(e) {
                return res.status(401).json({message: 'Что-то пошло не так'})
            }
             
        }
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        try {
            // 1. Сначала проверяем, существует ли пользователь
            const userExists = await db.query(`SELECT id FROM users WHERE id = $1`, [id]);
    
            if (userExists.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // 2. Удаляем записи из таблицы refresh, связанные с пользователем
            await db.query(`DELETE FROM refresh WHERE user_id = $1`, [id]);
    
            // 3. Удаляем пользователя из таблицы users
            const result = await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    
            // 4. Проверяем, было ли удалено какое-либо количество строк
            if (result.rowCount === 1) {
                return res.status(200).json({ message: 'User deleted successfully' });
            } else {
                // Этот случай маловероятен, но все же обрабатываем его
                return res.status(500).json({ message: 'Failed to delete user (unknown error)' });
            }
    
        } catch (e) {
            console.error("Error deleting user:", e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    
}

module.exports = new UserController();