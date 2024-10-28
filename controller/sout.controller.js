const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');

class SoutController {
    async createSout(req, res) {
        const { name } = req.body;
        const file = req.file;

        if (!file) {
            return res
                .status(400)
                .json({ message: 'Пожалуйста, загрузите файл' });
        }
        try {
            const fileSize = req.file.size;
            const index = req.file.originalname.lastIndexOf('.');
            const fileType = req.file.originalname.slice(
                index,
                req.file.originalname.length,
            );

            const url = `${req.file.filename}`;
            const newSout = await db.query(
                `INSERT INTO sout (name, fileSize, fileType, url) values ($1, $2, $3, $4) RETURNING *`,
                [name, fileSize, fileType, url],
            );
            res.json(newSout.rows[0]);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getAllSouts(req, res) {
        try {
            const souts = await db.query(`SELECT * FROM sout`);
            res.json(souts.rows);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getPaginationSouts(req, res) {
        const page = req.params.page;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {
            const souts = await db.query(`SELECT * FROM sout`);
            const result = souts.rows.slice(startIndex, endIndex);
            const totalPages = Math.ceil(souts.rows.length / limit);
            res.json({ result: result, pages: totalPages });
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getSearchSout(req, res) {
        const string = req.params.string;

        try {
            const souts = await db.query(`SELECT * FROM sout`);
            let result = [];
            souts.rows.forEach((item) => {
                if (item.name.toLowerCase().includes(string.toLowerCase())) {
                    result.push(item);
                }
            });
            res.json(result);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getOneSout(req, res) {
        const id = req.params.id;
        try {
            const sout = await db.query(`SELECT * FROM sout where id = $1`, [
                id,
            ]);
            res.json(sout.rows[0]);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async updateSout(req, res) {
        const { name, id } = req.body;
        const file = req.file;

        if (!file) {
            try {
                const sout = await db.query(
                    `UPDATE sout SET name = $1 where id = $2 RETURNING *`,
                    [name, id],
                );
                res.json(sout.rows[0]);
            } catch (e) {
                return res.status(404).json({ message: e.message });
            }
        } else {
            try {
                const soutFile = await db.query(
                    `SELECT * FROM sout where id = $1`,
                    [id],
                );

                fs.unlink(
                    `${keys.del_url}${soutFile.rows[0].url}`,
                    function (err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    },
                );
                const fileSize = req.file.size; //проверить
                const fileType = req.type; //проверить
                const url = req.file.filename;
                const sout = await db.query(
                    `UPDATE sout SET name = $1, fileSize = $2, fileType = $3, url = $4 where id = $5 RETURNING *`,
                    [name, fileSize, fileType, url, id],
                );
                res.json(sout.rows[0]);
            } catch (e) {
                return res.status(404).json({ message: e.message });
            }
        }
    }

    async deleteSout(req, res) {
        const id = req.params.id;
        try {
            const soutFile = await db.query(
                `SELECT * FROM sout where id = $1`,
                [id],
            );

            fs.unlink(
                `${keys.del_url}${soutFile.rows[0].file}`,
                function (err) {
                    if (err) return console.log(err);
                    console.log('file deleted successfully');
                },
            );
            const sout = await db.query(`DELETE FROM sout where id = $1`, [id]);
            return res.json(sout.rows[0]);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }
}

module.exports = new SoutController();
