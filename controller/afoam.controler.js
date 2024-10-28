const db = require('../db');
// const keys = require('./../config/keys');
// const fs = require('fs');

class AfoamController {
    async getAllAfoam(req, res) {
        try {
            const goods = await db.query(
                `SELECT id, advantages, name, description FROM goods ORDER BY id DESC LIMIT 5`,
            );
            res.json(goods.rows);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getOneAfoam(req, res) {
        const id = req.params.id;
        try {
            const good = await db.query(`SELECT * FROM goods where id = $1`, [
                id,
            ]);

            res.json(good.rows[0]);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }
}

module.exports = new AfoamController();
