require('dotenv').config();

// //* HOST *//
// const HOST = process.env.HOST;

// //* Nodemailer *//
// const EMAIL_HOST = process.env.EMAIL_HOST;
// const EMAIL_PORT = process.env.EMAIL_PORT;
// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;
// const DESTINATION_EMAIL = process.env.DESTINATION_EMAIL;

// module.exports = {
//     HOST,
//     EMAIL_HOST,
//     EMAIL_PORT,
//     EMAIL_USER,
//     EMAIL_PASS,
//     DESTINATION_EMAIL,
// };

const {
    PORT,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    DESTINATION_EMAIL,
} = process.env;

const config = {
    PORT: PORT || 5000,
    EMAIL_HOST: EMAIL_HOST,
    EMAIL_PORT: EMAIL_PORT,
    EMAIL_USER: EMAIL_USER,
    EMAIL_PASS: EMAIL_PASS,
    DESTINATION_EMAIL: DESTINATION_EMAIL,
};

module.exports = config;
