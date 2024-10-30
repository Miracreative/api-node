require('dotenv').config();

const mailer = require('nodemailer');

// const {
//     EMAIL_HOST,
//     EMAIL_PORT,
//     EMAIL_USER,
//     EMAIL_PASS,
//     DESTINATION_EMAIL,
// } = require('../utils/url.js');

const config = require('../utils/config.js');

const smtpTransport = mailer.createTransport(
    {
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: true,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
    },
    {
        from: `Запрос на обратную связь <${config.DESTINATION_EMAIL}>`, // От кого
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
