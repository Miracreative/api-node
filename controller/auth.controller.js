const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const crypto = require('crypto') 

const mailer = require('../utils/nodemailer')
const errorHandler = require('../utils/errorHandler')

const db = require('../db');

class AuthController {
    async login(req, res) { 
        try {
            const {email, password} = req.body.data;
            const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
            if(candidate.rowCount !== 0) {
                const passwordResult = bcrypt.compareSync(password, candidate.rows[0].password)
                if(passwordResult) {
                    const token = jwt.sign({
                        id: candidate.rows[0].id,
                        email: candidate.rows[0].email,
                        role: candidate.rows[0].email
                    }, keys.jwt, {expiresIn: 60 * 60}) // 60 секунд * 60 минут
    
                    const refresh_token = jwt.sign({
                        id: candidate.rows[0].id,
                        email: candidate.rows[0].email,
                        role: candidate.rows[0].email
                    }, keys.refresh, {expiresIn: 60 * 60 * 24 * 5})

                    const user_id = candidate.rows[0].id

                    try {
                        const newUserRefresh = await db.query(`INSERT INTO refresh (refresh_token, user_id) values ($1, $2) RETURNING *`, [refresh_token, user_id])
                        
                        res.cookie('refresh_token', refresh_token, {maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true})
                        return res.json({token: `Bearer ${token}`, refresh_token: refresh_token})
    
                    } catch(e) {
                        return res.status(500).json({message: 'Ошибка сервера при создании рефреш токена'})
                    }
    
                } else {
                   return res.status(401).json({message: 'Пароли не совпали'})
                }
            } else {
               return res.status(404).json({message: 'Пользователя нет, ошибка'})
            }
        }  catch(e) {
            return res.status(500).json({message: 'Упс! Что-то пошло не так'});
        }
       
    } 

    async logout(req, res) {
        try {
            const {refresh_token} = req.cookies;
            const remoovedToken = await db.query(`SELECT * FROM refresh WHERE refresh_token = $1::text`, [refresh_token]);
            if(remoovedToken.rowCount !== 0) {
                await db.query(`DELETE FROM refresh WHERE refresh_token = $1::text`, [refresh_token]);
                res.clearCookie('refresh_token')
                return res.json({message: 'Вы вышли из системы'})
            }
        } catch(e) {
            return res.status(500).json({message: 'Упс! Что-то пошло не так'});
        }
    }

    async refresh(req, res) {
        try {
            const {refresh_token} = req.cookies;
            const refreshToken = await db.query(`SELECT * FROM refresh WHERE refresh_token = $1::text`, [refresh_token]);
            if(refreshToken.rowCount !== 0) {
                const token = jwt.sign({
                    id: candidate.rows[0].id,
                    email: candidate.rows[0].email,
                    role: candidate.rows[0].email
                }, keys.jwt, {expiresIn: 60 * 60}) 
                return res.json({token: `Bearer ${token}`})
            }
        } catch(e) {
            return res.status(500).json({message: 'Упс! Что-то пошло не так'});
        }
    }

    async register(req, res) {
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.data.admin.password, salt)
        const {name, email, role} = req.body.data.admin;

        const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
         
        if(candidate.rowCount !== 0) {
            res.status(409).json({message: 'Email уже существует'})
        } else {
            try {
                const newUser = await db.query(`INSERT INTO users (name, email, password, role) values ($1, $2, $3, $4) RETURNING *`, [name, email, password, role])
                res.status(201).json(newUser.rows[0])

                const message = {
                    to: email,
                    subject: 'Вас зарегистрированы в качестве администратора',
                    html: `
                        <h1>Ваши данные:</h1>
                        <p>имя: <b>${name}</b>,</p>
                        <p>login: <b>${email}</b>,</p>
                        <p>пароль: <b>${req.body.password}/b></p>

                        <i>Данное письмо не требует ответа</i>
                    `
                }

                mailer(message)
            } catch(e) {
                return res.status(500).json({message: 'Упс! Что-то пошло не так'});
            }
             
        }
    }

    async reset(req, res) {
        try {
          
            crypto.randomBytes(32, async (err, buffer) => {
                if(err) {
                    return res.json({message: 'Попробуйте позже', err})
                }
                const {email} = req.body.data;
                const token = buffer.toString('hex')
                const resetTokenExp = Date.now() + 60 * 60 * 1000
                const candidate = await db.query(`SELECT * FROM users WHERE email = $1::text`, [email]);
                if(candidate.rowCount !== 0) {
                    const user_id = candidate.rows[0].id
                    const newUserReset = await db.query(`INSERT INTO reset (resetToken, resetTokenExp, user_id) values ($1, $2, $3) RETURNING *`, [token, resetTokenExp, user_id])
                    res.status(201).json(newUserReset.rows[0])
                    // <p><a href="${keys.base_url}/auth/password/${token}">Восстановить доступ</a></p>
                    console.log(email, newUserReset.rows[0])
                    const message = {
                        to: email,
                        subject: 'Восстановление доступа',
                        html: ` 
                            <h1>Вы забыли пароль?</h1>
                            <p>Если нет, то проигнорируйте это письмо</p>
                            <p>Иначе, нажмите ссылку ниже:</p>
                            <p><a href="${keys.front_url}/password/${token}">Восстановить доступ</a></p>

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
        const {id, name, email, role} = req.body.data;
    
        const candidate = await db.query(`SELECT * FROM users WHERE id = $1::int`, [id]);
        if(candidate.rowCount == 0) {
            res.status(409).json({message: 'Пользователя нет'})
        } else {
            try {
                const updateUser = await db.query(`UPDATE users SET name = $1 email = $2, password = $3, role = $4 where id = $5 RETURNING *`, [name, email, password, role, id])
                res.status(201).json(updateUser.rows[0])

                const message = {
                    to: email,
                    subject: 'Ваши новые данные в качестве администратора',
                    html: `
                        <h1>Ваши данные:</h1>
                        <p>имя: <b>${name}</b>,</p>
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

}

module.exports = new AuthController();