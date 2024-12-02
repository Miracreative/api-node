const nodemailer = require('nodemailer');
const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    DESTINATION_EMAIL,
} = require('../utils/config.js');


const transporter = nodemailer.createTransport(
    {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: false,
        requireTLS: true,
        logger: true,
        debug: true,
        auth: {
            user: 'radicall004@yandex.ru',
            pass: 'radicall004@yandex.ru',
        },
    },
    {
        from: 'Mailer test <radicall004@yandex.ru>',
    },
);

const mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err);
        console.log('Email sent: ', info);
    });
};

module.exports = mailer;

//   user: 'nanalitvinova16@yandex.ru',
//         pass: 'jeweqsadhybmqvck'
