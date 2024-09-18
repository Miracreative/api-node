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
                    subject: 'Вас зарегистрировал супер-админ',
                    text: `
                        Ваши данные:
                        login: ${email},
                        пароль: ${req.body.password}

                        Данное письмо не требует ответа
                    `
                }

                mailer(message)
            } catch(e) {
                errorHandler(res, e, 'почта')
            }
             
        }
    }

    async reset(req, res) {
        try {
            crypto.randomBytes(32, async (err, buffer) => {
                if(err) {
                    return res.json({message: 'Попробуйте позже', err})
                }

                const token = buffer.toString('hex')
                const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);

                if(candidate.rowCount !== 0) {
                    
                } else {
                    res.status(404).json({message: 'Tакого пользователя нет'})
                }
            })
        } catch(e) {
            errorHandler(res, e)
        }
    }
    
}

module.exports = new AuthController();