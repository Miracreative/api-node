// require('dotenv').config();

const mailer = require('nodemailer');

const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    DESTINATION_EMAIL,
} = require('../utils/config.js');

// const config = require('../utils/config.js');

const smtpTransport = mailer.createTransport(
    {
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
    },
    {
        from: `Запрос на обратную связь <${DESTINATION_EMAIL}>`, // От кого
    },
);

const sendEmail = async (message) => {
    try {
        const info = await smtpTransport.sendMail(message);
        console.log('Nodemailer: Письмо успешно отправлено!', info);
    } catch (error) {
        console.log(error);
        throw error; // Пробрасываем ошибку выше для обработки в маршруте
    } finally {
        smtpTransport.close();
    }
};

module.exports = sendEmail;
