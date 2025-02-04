const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');

class NewsController { 
    async createNews(req, res) {
        const { title, descr, content } = req.body;

        const files = req.files;
        console.log(content)
        if (!files.files.length) {
            return res
                .status(400)
                .json({ message: 'Пожалуйста, загрузите картинки' });
        }
        const carouselImages = req.files.files;
        let imagesSrc = [];
        carouselImages.map((file, index) => {
            imagesSrc.push(`${file.filename}`);
        });
      console.log('карусель', imagesSrc)
        const main = `${req.files.mainimage[0].filename}`;
        if (!main.length) {
            return res
                .status(400)
                .json({ message: 'Пожалуйста, загрузите картинку' });
        }
        // console.log('карусель', imagesSrc, 'ша', main)
        try {
            const newNews = await db.query(
                `INSERT INTO news (imagesSrc, title, descr, content, main) values ($1, $2, $3, $4, $5) RETURNING *`,
                [imagesSrc, title, descr, content, main],
            );
            res.json(newNews.rows[0]);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async getAllNews(req, res) {
        try {
            const news = await db.query(`SELECT * FROM news`);
            res.json(news.rows);
        } catch (e) {
            return res.json({ message: e.message });
        }
    }

    async getPaginationNews(req, res) {
        const page = req.params.page;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {
            const news = await db.query(`SELECT * FROM news`);
            const result = news.rows.slice(startIndex, endIndex);
            const totalPages = Math.ceil(news.rows.length / limit);
            res.json({ result: result, pages: totalPages });
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getSearchNews(req, res) {
        const string = req.params.string;

        try {
            const news = await db.query(`SELECT * FROM news`);

            let result = [];
            news.rows.forEach((item) => {
                console.log(
                    news.rows[0].title
                        .toLowerCase()
                        .includes(string.toLowerCase()),
                );
                if (
                    item.title.toLowerCase().includes(string.toLowerCase()) ||
                    item.content.toLowerCase().includes(string.toLowerCase()) ||
                    item.descr.toLowerCase().includes(string.toLowerCase())
                ) {
                    result.push(item);
                }
            });
            res.json(result);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getLastNews(req, res) {
        try {
            const news = await db.query(`SELECT * FROM news`);
            res.json(news.rows.slice(news.rows.length - 3, news.rows.length));
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getOneNews(req, res) {
        const id = req.params.id;
        try {
            const news = await db.query(`SELECT * FROM news where id = $1`, [
                id,
            ]);

            res.json(news.rows[0]);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async updateNews(req, res) {
        const { title, descr, content, id } = req.body;
        const files = req.files;
    
        try {
            // Проверка наличия загруженных файлов
            if (!files || files.length === 0) {
                // Если файлов нет, просто обновляем остальные поля
                const news = await db.query(
                    `UPDATE news SET title = $1, descr = $2, content = $3 WHERE id = $4 RETURNING *`,
                    [title, descr, content, id]
                );
                return res.json(news.rows[0]);
            }
    
            // Если файлы загружены, обрабатываем их
            let imagesSrc = [];
            
            // Извлечение имен загруженных файлов
            files.forEach(file => {
                imagesSrc.push(file.filename);
            });
    
            // Получаем старые изображения из базы данных для их удаления
            const imageFiles = await db.query(
                `SELECT imagesSrc FROM news WHERE id = $1`,
                [id]
            );
    
            // Удаляем старые файлы с диска
            if (imageFiles.rows.length > 0) {
                const oldImages = imageFiles.rows[0].imagessrc;
                oldImages.forEach(item => {
                    fs.unlink(`${keys.del_url}${item}`, (err) => {
                        if (err) {
                            console.error(`Ошибка при удалении файла ${item}:`, err);
                        } else {
                            console.log(`Файл ${item} успешно удален`);
                        }
                    });
                });
            }
    
            // Обновляем запись в базе данных с новыми изображениями
            const updatedNews = await db.query(
                `UPDATE news SET imagesSrc = $1, title = $2, descr = $3, content = $4 WHERE id = $5 RETURNING *`,
                [imagesSrc, title, descr, content, id]
            );
    
            return res.json(updatedNews.rows[0]);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
    async deleteNews(req, res) {
        const id = req.params.id;

        const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [
            id,
        ]);
        console.log(imageFiles.rows[0].imagessrc.split(','))

        imageFiles.rows[0].imagessrc.forEach((item) => {
            fs.unlink(`${keys.del_url}${item}`, function (err) {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        });

        try {
            const news = await db.query(`DELETE FROM news where id = $1`, [id]);
            res.json(news.rows[0]);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new NewsController();
