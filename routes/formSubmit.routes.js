// require('dotenv').config();

// const config = require('../utils/config.js');

const express = require('express');
const multer = require('multer');

const sendEmail = require('../utils/mail.js');

// const { EMAIL_USER } = require('../utils/url.js');
const {
    PORT,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    DESTINATION_EMAIL,
} = require('../utils/config.js');

const {
    MAIL_SUCCESSED,
    MAIL_SUBMISSION_ERROR,
    UNKNOWN_ERROR,
} = require('../utils/informMessages.js');

// const { METHOD_NOT_ALLOWED } = require('../utils/informMessages.js');

const router = express.Router();

// Настройка хранения файлов с помощью multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Папка для хранения загруженных файлов
    },
    filename: function (req, file, cb) {
        // Уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

// Фильтрация типов файлов (опционально)
const fileFilter = (req, file, cb) => {
    // Например, разрешить только PDF и изображения
    if (
        file.mimetype === 'application/pdf' ||
        file.mimetype.startsWith('image/')
    ) {
        cb(null, true);
    } else {
        cb(new Error('Недопустимый тип файла'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Маршрут для обработки POST-запроса с формой и файлом
router.post('/formSubmit', upload.single('file'), async (req, res) => {
    const { firstName, lastName, phoneNumber, email, comment } = req.body;
    const file = req.file;

    // Формирование сообщения для электронной почты
    const message = {
        to: EMAIL_USER, // Адрес получателя
        subject: `Письмо с сайта Atman Auto от ${firstName} ${lastName}`,
        text: `
    Имя: ${firstName}
    Фамилия: ${lastName}
    Телефон: ${phoneNumber}
    E-mail: ${email}
    Сообщение:
    ${comment}
    
    Письмо сформировано системой автоматически, на него не нужно отвечать.
    `,
        html: `
    <p><strong>Имя:</strong> ${firstName}</p>
    <p><strong>Фамилия:</strong> ${lastName}</p>
    <p><strong>Телефон:</strong> ${phoneNumber}</p>
    <p><strong>E-mail:</strong> ${email}</p>
    <p><strong>Сообщение:</strong></p>
    <p>${comment}</p>
    <br>
    <p><em>Письмо сформировано системой автоматически, на него не нужно отвечать.</em></p>
    `,
    };

    // Если файл прикреплен, добавляем его в письмо
    if (file) {
        message.attachments = [
            {
                filename: file.originalname,
                path: file.path,
            },
        ];
    }

    try {
        await sendEmail(message);
        console.log('Письмо успешно отправлено!', message);
        res.status(200).send(MAIL_SUCCESSED);
    } catch (error) {
        console.error(`${MAIL_SUBMISSION_ERROR}:`, error);
        res.status(500).send(MAIL_SUBMISSION_ERROR, UNKNOWN_ERROR);
    }
});

module.exports = router;
