const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');

class NewsController { 
    async createNews(req, res) {
        const { title, descr, content } = req.body;

        const files = req.files;
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
            console.log(news, news.rows.slice(news.rows.length - 3, news.rows.length))
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
        try {
            if(req.files?.mainimage &&  req.files?.files) {


                const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [
                    id,
                ]);
                // console.log(imageFiles.rows[0].imagessrc.split(','))
        
                imageFiles.rows[0].imagessrc.forEach((item) => {
                    fs.unlink(`${keys.del_url}${item}`, function (err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                });

                
                fs.unlink(`${keys.del_url}${imageFiles.rows[0].main}`, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });
                const main = `${req.files?.mainimage[0].filename}`;
                const carouselImages = req.files?.files;
                let imagesSrc = [];
                    carouselImages.map((file, index) => {
                        imagesSrc.push(`${file.filename}`);
                    });
                    const updatedNews = await db.query(
                        `UPDATE news SET title = $1, descr = $2, content = $3, main = $4, imagesSrc = $5 WHERE id = $6 RETURNING *`,
                        [title, descr, content, main, imagesSrc, id]
                    );
            
                   return  res.json(updatedNews.rows);
            } else if( req.files?.mainimage && !req.files?.files) {

                
                const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [
                    id,
                ]);
                
                fs.unlink(`${keys.del_url}${imageFiles.rows[0].main}`, function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                });
                const main = `${req.files?.mainimage[0].filename}`;
                    const updatedNews = await db.query(
                        `UPDATE news SET title = $1, descr = $2, content = $3, main = $4 WHERE id = $5 RETURNING *`,
                        [title, descr, content, main, id]
                    );
                    return  res.json(updatedNews.rows);
                } else if(req.files.files && !req.files?.mainimage) {

                    
                    const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [
                        id,
                    ]);
                    // console.log(imageFiles.rows[0].imagessrc.split(','))
            
                    imageFiles.rows[0].imagessrc.forEach((item) => {
                        fs.unlink(`${keys.del_url}${item}`, function (err) {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });
                    });
                    const carouselImages = req.files?.files;
                    let imagesSrc = [];
                    carouselImages.map((file, index) => {
                        imagesSrc.push(`${file.filename}`);
                    });
                    const updatedNews = await db.query(
                        `UPDATE news SET title = $1, descr = $2, content = $3, imagesSrc = $4 WHERE id = $5 RETURNING *`,
                        [title, descr, content, imagesSrc, id]
                    );
                    console.log(res.json(updatedNews.rows))
            
                   return  res.json(updatedNews.rows);
            } else {
                const updatedNews = await db.query(
                    `UPDATE news SET title = $1, descr = $2, content = $3 WHERE id = $4 RETURNING *`,
                    [title, descr, content, id]
                );
        
               return  res.json(updatedNews.rows);
            }
         
        } catch (e) {
            console.error('Ошибка при обновлении новости:', e.message);
            return res.status(500).json({ message: 'Ошибка при обновлении новости', error: e.message });
        }
    }
    
    async deleteNews(req, res) {
        const id = req.params.id;

        try {
            
            // const imageFiles = await db.query(`SELECT * FROM news where id = $1`, [
            //     id,
            // ]);
            // // console.log(imageFiles.rows[0].imagessrc.split(','))
    
            // imageFiles.rows[0].imagessrc.forEach((item) => {
            //     fs.unlink(`${keys.del_url}${item}`, function (err) {
            //         if (err) return console.log(err);
            //         console.log('file deleted successfully');
            //     });
            // });

            
            // fs.unlink(`${keys.del_url}${imageFiles.rows[0].main}`, function (err) {
            //     if (err) return console.log(err);
            //     console.log('file deleted successfully');
            // });
            const news = await db.query(`DELETE FROM news where id = $1`, [id]);
            res.json(news.rows[0]);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
}

module.exports = new NewsController();
