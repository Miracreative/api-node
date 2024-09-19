const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const crypto = require('crypto')

const mailer = require('../utils/nodemailer')
const errorHandler = require('../utils/errorHandler')

const db = require('../db');
const { validationResult } = require('express-validator/');

class AuthController {
    async login(req, res) {
        const {email, password} = req.body;
        const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
        if(candidate.rowCount !== 0) {
            const passwordResult = bcrypt.compareSync(password, candidate.rows[0].password)
            if(passwordResult) {
                const token = jwt.sign({
                    id: candidate.rows[0].id,
                    email: candidate.rows[0].email,
                    role: candidate.rows[0].email
                }, keys.jwt, {expiresIn: 60 * 60}) // 60 секунд * 60 минут
                res.json({token: `Bearer ${token}`})
            } else {
                res.status(401).json({message: 'Пароли не совпали'})
            }
        } else {
            res.status(404).json({message: 'Пользователя нет, ошибка'})
        }
    } 

    async register(req, res) {
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt)
        const {email} = req.body;
        const role = "admin"

        const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
        
        if(candidate.rowCount !== 0) {
            res.status(409).json({message: 'Email already exists'})
        } else {
            const errors = validationResult(req)
            if(errors.errors.length) {
                return res.status(400).json({message: 'Ошибка валидации', errors: errors})
            }
            try {
                const newUser = await db.query(`INSERT INTO users (email, password, role) values ($1, $2, $3) RETURNING *`, [email, password, role])
                res.status(201).json(newUser.rows[0])

                const message = {
                    to: email,
                    subject: 'Вас зарегистрированы в качестве администратора',
                    html: `
                        <h1>Ваши данные:</h1>
                        <p>login: <b>${email}</b>,</p>
                        <p>пароль: <b>${req.body.password}/b></p>

                        <i>Данное письмо не требует ответа</i>
                    `
                }

                mailer(message)
            } catch(e) {
                errorHandler(res, e)
            }
             
        }
    }

    async reset(req, res) {
        try {
          
            crypto.randomBytes(32, async (err, buffer) => {
                if(err) {
                    return res.json({message: 'Попробуйте позже', err})
                }
                const {email} = req.body;
                const token = buffer.toString('hex')
                const resetTokenExp = Date.now() + 60 * 60 * 1000
                const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
                if(candidate.rowCount !== 0) {
                    const user_id = candidate.rows[0].id
                    console.log(user_id)
                    const newUserReset = await db.query(`INSERT INTO reset (resetToken, resetTokenExp, user_id) values ($1, $2, $3) RETURNING *`, [token, resetTokenExp, user_id])
                    res.status(201).json(newUserReset.rows[0])
                    const message = {
                        to: email,
                        subject: 'Восстановление доступа',
                        html: ` 
                            <h1>Вы забыли пароль?</h1>
                            <p>Если нет, то проигнорируйте это письмо</p>
                            <p>Иначе, нажмите ссылку ниже:</p>
                            <p><a href="${keys.base_url}/auth/password/${token}">Восстановить доступ</a></p>

                            <i>Данное письмо не требует ответа</i>
                        `
                    }
                    mailer(message) 
                    // res.redirect('/auth/login') --- так вернуть на страницу ввода логина можно
                } else {
                    res.status(404).json({message: 'Tакого пользователя нет'})
                }
            })
        } catch(e) {
            errorHandler(res, e)
        }
    }
    
    async password(req, res) {
        const token = req.params.token
        if(!token) {
            return res.status(400).json({message: 'Нет токена'})
            // return res.redirect('/auth/login') // в проде надо перекидывать
        }
        try {
            const userReset = await db.query(`SELECT * FROM reset WHERE resetToken = $1::text`, [token]);
            if(userReset.rowCount !== 0) {
                const user_id = userReset.rows[0].user_id;
                const userData = await db.query(`SELECT * FROM users WHERE id = $1::int`, [user_id]);
                console.log(userData.rows[0].email)
                const userEmail = userData.rows[0].email;
                const userRole = userData.rows[0].role;
                const liveTimeToken = +userReset.rows[0].resettokenexp;
                const liveTime = +Date.now();
                if(liveTime > liveTimeToken) {
                    res.status(200).json({message: "Разрешаю ввести новый пароль", code: 1, id: user_id, email: userEmail, role: userRole})
                    // return res.redirect('/auth/login') // в проде надо перекидывать
                } else {
                    res.status(404).json({message: 'Время истекло, запросите смену пароля', code: 0})
                    // return res.redirect('/auth/login') // в проде надо перекидывать
                }
            } else {
                res.status(404).json({message: 'Запросите заново сброс пароля', code: 0})
            }
        } catch(e) {
            errorHandler(res, e)
        }
        
    }

    async updateUser(req, res) {
 
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt)
        const {id, email, role} = req.body;
    
        const candidate = await db.query(`SELECT * FROM users WHERE id = $1::int`, [id]);
        console.log(candidate)
        if(candidate.rowCount == 0) {
            res.status(409).json({message: 'Пользователя нет'})
        } else {
            const errors = validationResult(req)
            if(errors.errors.length) {
                return res.status(400).json({message: 'Ошибка валидации', errors: errors})
            }  
            try {
                const updateUser = await db.query(`UPDATE users SET email = $1, password = $2, role = $3 where id = $4 RETURNING *`, [email, password, role, id])
                res.status(201).json(updateUser.rows[0])

                const message = {
                    to: email,
                    subject: 'Ваши новые данные в качестве администратора',
                    html: `
                        <h1>Ваши данные:</h1>
                        <p>login: <b>${email}</b>,</p>
                        <p>пароль: <b>${req.body.password}</b></p>

                        <i>Данное письмо не требует ответа</i>
                    `
                }

                mailer(message)
            } catch(e) {
                errorHandler(res, e)
            }
             
        }
    }

    async deleteUser(req, res) {
        const {id} = req.body
        const user = await db.query(`DELETE FROM users where id = $1`, [id])
        res.json(user.rows[0])
    }
}

module.exports = new AuthController();