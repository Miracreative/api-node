const db = require('../db');
const errorHandler = require('../utils/errorHandler')

class GoodsController {
    async createGood(req, res) {
        const { material, parameter, mainParameter, article, thinkness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, typeGlue} = req.body;
     
        const personalImages = req.files.goodsPersonalImages;
        // if (!personalImages) {
        //     res.status(400)
        //     throw new Error('Пожалуйста, загрузите картинки')
        // } необязательное поле


        let goodsPersonalImages = [];
        personalImages.map((file, index) => {
            goodsPersonalImages.push(`${file.destination}${file.filename}`)
        })
        
        const industrialImages = req.files.goodsIndustrialImages;
        // if (!industrialImages) {
        //     res.status(400)
        //     throw new Error('Пожалуйста, загрузите картинки')
        // } необязательное поле

        let goodsIndustrialImages = [];
        industrialImages.map((file, index) => {
            goodsIndustrialImages.push(`${file.destination}${file.filename}`)
        })
        
        const imageUrl = `${req.files.imageUrl[0].destination}${req.files.imageUrl[0].filename}`;
        if (!imageUrl) {
            res.status(400)
            throw new Error('Пожалуйста, загрузите картинку')
        }

        const pdfUrl = `${req.files.pdfUrl[0].destination}${req.files.pdfUrl[0].filename}`;
        if (!pdfUrl) {
            res.status(400)
            throw new Error('Пожалуйста, загрузите файл')
        }

        try {
            const newGood = await db.query(`INSERT INTO goods (material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, goodsPersonalImages, goodsIndustrialImages, imageUrl, pdfUrl, typeGlue) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`, [material, parameter, mainParameter, article, thinkness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, goodsPersonalImages, goodsIndustrialImages, imageUrl, pdfUrl, typeGlue])

            res.json(newGood.rows[0])

        } catch(e) {
            errorHandler(res, e)
        }
         
    }
    async getAllGoods(req, res) {
        try {
            const goods = await db.query(`SELECT * FROM goods`,)
            res.json(goods.rows)
        } catch(e) {
            errorHandler(res, e)
        }
    } 
    async getOneGood(req, res) {
        const id = req.params.id
        try {
            const good = await db.query(`SELECT * FROM goods where id = $1`, [id])
      
            res.json(good.rows[0])
        } catch(e) {
            errorHandler(res, e)
        }
        
    }
    async updateGoods(req, res) { 
        const {material, parameter, mainParameter, article, thinkness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, typeGlue, id} = req.body;
     
        const files = req.files;
        if (!files?.[0]) {
            const goods = await db.query(`UPDATE goods SET  material = $1, parameter = $2, mainParameter = $3, article = $4, thickness = $5, volume = $6, pcs = $7, baseType = $8, color = $9, heatResistance = $10, name = $11, description = $12, type = $13, size = $14, brand = $15, linerType = $16, dencity = $17, typeGlue = $18 where id = $19 RETURNING *`, [ material, parameter, mainParameter, article, thinkness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, typeGlue, id])
            res.json(goods.rows[0])
        } else {
            const personalImages = req.files.goodsPersonalImages;
            if(personalImages) {
                let goodsPersonalImages = [];
                personalImages.map((file, index) => {
                    goodsPersonalImages.push(`${file.destination}${file.filename}`)
                })
            }

            const industrialImages = req.files.goodsIndustrialImages;
            if(industrialImages) {
                let goodsIndustrialImages = [];
                industrialImages.map((file, index) => {
                    goodsIndustrialImages.push(`${file.destination}${file.filename}`)
                })
            }
           
            const imageUrl = `${req.files?.imageUrl?.[0]?.destination}${req.files?.imageUrl?.[0]?.filename}`;
            if(imageUrl) {

            }

            const pdfUrl = `${req.files?.pdfUrl?.[0]?.destination}${req.files?.pdfUrl?.[0]?.filename}`;
            if(pdfUrl) {
                try {
                    const goods = await db.query(`UPDATE goods SET  material = $1, parameter = $2, mainParameter = $3, article = $4, thickness = $5, volume = $6, pcs = $7, baseType = $8, color = $9, heatResistance = $10, name = $11, description = $12, type = $13, size = $14, brand = $15, linerType = $16, dencity = $17, pdfUrl = $18, typeGlue = $19 where id = $20 RETURNING *`, [ material, parameter, mainParameter, article, thinkness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, pdfUrl, typeGlue, id])
                    res.json(goods.rows[0])
                } catch (e) {
                    errorHandler(res, e)
                }
            }
        }
    } 
    async deleteGood(req, res) {
        const {id} = req.body;
        try {
            const news = await db.query(`DELETE FROM news where id = $1`, [id])
            res.json(news.rows[0])
        } catch(e) {
            errorHandler(res, e)
        }
        
    }
    async sortGoodsOnMainParameters(req, res) {
        const {main} = req.body;
        try {
            const goods = await db.query(`SELECT * FROM goods`)
        // console.log(goods.rows)
            goods.rows.forEach((row, i) => {
                for(let j=0; j < row.mainparameter.length; j++) {
                    row.mainparameter[j] == main[j]
                    if((row.mainparameter[j] == main[j]) && (main[j] == 1)) {
                        
                        return console.log(i)
                    } 
                }
            })
        } catch(e) {
            errorHandler(res, e)
        }
        
    }
}

module.exports = new GoodsController();