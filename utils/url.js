//* HOST *//
const HOST = process.env.HOST;

//* Nodemailer *//
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const DESTINATION_EMAIL = process.env.DESTINATION_EMAIL;

module.exports = {
    HOST,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    DESTINATION_EMAIL,
};
