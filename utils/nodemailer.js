const nodemailer = require('nodemailer');
  
const transporter = nodemailer.createTransport(
    {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'nanalitvinova16@yandex.ru',
            pass: 'jeweqsadhybmqvck'
        }
    },
    {
        from: 'Mailer test <nanalitvinova16@yandex.ru>',
    }
)

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) return console.log(err);
        console.log('Email sent: ', info)
    })
}

module.exports = mailer;

    //   user: 'nanalitvinova16@yandex.ru',
    //         pass: 'jeweqsadhybmqvck'