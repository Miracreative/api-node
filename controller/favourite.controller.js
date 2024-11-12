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
        const {good_id} = req.params;
        try {
            console.log(good_id)
            const favorite = await db.query(
                `SELECT * FROM favorites where good_id = $1`,
                [good_id],
            );
            console.log(favorite.rows)
            // const favorites = await db.query(`DELETE FROM favorites where good_id = $1`, [good_id])
            // console.log(favorites)
            // return res.json(favorites.rows[0])
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
                // console.log(favouriteGoods.rows)
                
                res.json({goodsList: goodList.rows, favourite: favouriteGoods.rows})
            } catch(e) {
                return res.status(400).json({message: e.message})
            }

        } catch(e) {
            return res.status(404).json({message: e.message})
        }
    }
} 

module.exports = new FavouriteController(); 