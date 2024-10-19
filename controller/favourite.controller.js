const db = require('../db');

class FavouriteController {
    async createFavourite(req, res) {
        const {good_id} = req.body.data;
        try {
            const newFavourite = await db.query(`INSERT INTO favorites (good_id) values ($1) RETURNING *`, [good_id])
            res.json(newFavourite.rows[0])
        } catch (e) {
            return res.status(404).json({message: e.message})
        }
    }
     
    async deleteFavourite(req, res) {
        const {id} = req.params;
        try {
            await db.query(`DELETE FROM favorites WHERE id = $1`, [id])
            res.json({message: 'Избранное удалено'})
        } catch (e) {
            return res.status(404).json({message: e.message})
        }
    }

    async getFavouriteGoods(req, res) {
        try {
            const favouriteGoods = await db.query(`SELECT * FROM favorites`)

            let favouriteGoodsId = []

            favouriteGoods.rows.forEach(item => {
                favouriteGoodsId.push(item.good_id)
            })
            try {
                const goodList = await db.query(`SELECT * FROM goods WHERE id IN (${favouriteGoodsId.join(',')})`)
                res.json(goodList.rows)
            } catch(e) {
                return res.status(400).json({message: e.message})
            }

        } catch(e) {
            return res.status(404).json({message: e.message})
        }
    }
} 

module.exports = new FavouriteController(); 