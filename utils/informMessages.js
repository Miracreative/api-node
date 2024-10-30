//* Информационные сообщения *//

const LOADING_INFO = 'Загрузка информации, подождите...';
const NOT_FOUND_INFO = 'По вашему запросу ничего не найдено';

//* Сообщения об успехе *//

const MAIL_SUCCESSED = 'Письмо успешно отправлено!';

//* Сообщения об ошибке *//

// Общие
const LOADING_DATA_ERROR = 'Произошла ошибка при загрузке данных';
const UNKNOWN_ERROR = 'Произошла неизвестная ошибка';
const METHOD_NOT_ALLOWED = 'Метод не разрешён';

// Почтовые
const MIN_LENGTH_FIELD = 'Минимальное количество символов: 2';
const REQUIRED_FIELD = 'Обязательное поле';
const INCORRECT_EMAIL = 'Некорректный адрес электронной почты';
const INCORRECT_PHONE = 'Некорректный номер телефона';
const MAIL_SUBMISSION_ERROR = 'Ошибка при отправке письма.';

module.exports = {
    LOADING_INFO,
    MAIL_SUCCESSED,
    LOADING_DATA_ERROR,
    NOT_FOUND_INFO,
    MIN_LENGTH_FIELD,
    REQUIRED_FIELD,
    MAIL_SUBMISSION_ERROR,
    INCORRECT_EMAIL,
    INCORRECT_PHONE,
    UNKNOWN_ERROR,
    METHOD_NOT_ALLOWED,
};
