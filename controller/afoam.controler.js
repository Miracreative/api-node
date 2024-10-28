const db = require('../db');
// const keys = require('./../config/keys');
// const fs = require('fs');

class AfoamController {
    async getAllAfoam(req, res) {
        try {
            const recomendedGoods = await db.query(
                `SELECT id, advantages, name, description FROM goods ORDER BY id DESC LIMIT 5`,
            );
            res.json(recomendedGoods.rows);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getOneAfoam(req, res) {
        const id = req.params.id;
        try {
            const oneRecomendedGood = await db.query(
                `SELECT id, advantages, name, description FROM goods where id = $1`,
                [id],
            );

            res.json(oneRecomendedGood.rows[0]);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }
}

module.exports = new AfoamController();
