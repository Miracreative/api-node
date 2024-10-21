const db = require('../db');
const errorHandler = require('../utils/errorHandler');

// const keys = require('../config/keys')

class GoodsController {
    async createGood(req, res) {
        const { material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, typeGlue, advantages} = req.body;
     
        const personalImages = req.files.goodsPersonalImages;

        let goodsPersonalImages = [];
        personalImages.map((file, index) => {
            goodsPersonalImages.push(`${file.destination}${file.filename}`)
        })
        
        const industrialImages = req.files.goodsIndustrialImages;

        let goodsIndustrialImages = [];
        industrialImages.map((file, index) => {
            goodsIndustrialImages.push(`${file.destination}${file.filename}`)
        })
        
        const imageUrl = `${req.files.imageUrl[0].destination}${req.files.imageUrl[0].filename}`;
        if (!imageUrl) {
            return res.status(400).json({message: "Пожалуйста, загрузите картинку"})
        } 

        const pdfUrl = `${req.files.pdfUrl[0].destination}${req.files.pdfUrl[0].filename}`;
        if (!pdfUrl) {
            return res.status(400).json({message: "Пожалуйста, загрузите файл"})
        }

        try {
            const newGood = await db.query(`INSERT INTO goods (material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, goodsPersonalImages, goodsIndustrialImages, imageUrl, pdfUrl, typeGlue, advantages) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`, [material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, goodsPersonalImages, goodsIndustrialImages, imageUrl, pdfUrl, typeGlue, advantages])

            return res.json(newGood.rows[0])

        } catch(e) {
            errorHandler(res, e)
        }
         
    }
    async getAllGoods(req, res) {
        try {
            const goods = await db.query(`SELECT * FROM goods`,)
            res.json(goods.rows)
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
    }  
    async getOneGood(req, res) {
        const id = req.params.id
        try {
            const good = await db.query(`SELECT * FROM goods where id = $1`, [id])
      
            res.json(good.rows[0])
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
        
    }
    async getPaginationGoods(req, res) {
        const {page} = req.params;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    

        try {   
            const goods = await db.query(`SELECT * FROM goods`)
            const result = goods.rows.slice(startIndex, endIndex)
            const totalPages = Math.ceil(goods.rows.length / limit)
            res.json({result: result, pages: totalPages})
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 

    async getSearchGoods(req, res) {
        const string = req.params.string;
       
        try {   
            const news = await db.query(`SELECT * FROM goods`)
            
            let result = [];
            news.rows.forEach(item => {
                if (item.name.toLowerCase().includes(string.toLowerCase()) || item.description.toLowerCase().includes(string.toLowerCase())) {
                    result.push(item)
                }
            })
            res.json(result)
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
      
    } 
    async updateGoods(req, res) { 
        const {material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, typeGlue, id} = req.body;
     
        const files = req.files;
        if (!files?.[0]) {
            const goods = await db.query(`UPDATE goods SET  material = $1, parameter = $2, mainParameter = $3, article = $4, thickness = $5, volume = $6, pcs = $7, baseType = $8, color = $9, heatResistance = $10, name = $11, description = $12, type = $13, size = $14, brand = $15, linerType = $16, dencity = $17, typeGlue = $18, advantages = $19 where id = $20 RETURNING *`, [ material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, typeGlue, advantages, id])
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
                    const goods = await db.query(`UPDATE goods SET  material = $1, parameter = $2, mainParameter = $3, article = $4, thickness = $5, volume = $6, pcs = $7, baseType = $8, color = $9, heatResistance = $10, name = $11, description = $12, type = $13, size = $14, brand = $15, linerType = $16, dencity = $17, pdfUrl = $18, typeGlue = $19, advantages = $20 where id = $21 RETURNING *`, [ material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, pdfUrl, typeGlue, advantages, id])
                    res.json(goods.rows[0])
                } catch (e) {
                    return res.status(404).json({message: e.message})
                }
            }
        }
    } 
    async deleteGood(req, res) {
        const {id} = req.params;
        try {
            const goods = await db.query(`DELETE FROM goods where id = $1`, [id])
            res.json(goods.rows[0])
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
        
    }
    async sortGoodsOnMainParameters(req, res) {
        const {main} = req.params;
        const mainInt = main.replaceAll(',', '')
        let mainArray = [];
        for(let i=0; i < mainInt.length; i++) {
            mainArray.push(mainInt[i])
        }
        try {
        const goods = await db.query(`SELECT * FROM goods`)
        let searchIndexes = []
        const getIndexesArray = () => {
            goods.rows.forEach((row, i) => {
                for(let j=0; j < row.mainparameter.length; j++) {
                    row.mainparameter[j] == mainArray[j]
                    if((row.mainparameter[j] == mainArray[j]) && (mainArray[j] == 1)) {
                       return searchIndexes.push(i)
                    } 
                }
            })
        }
        getIndexesArray()

        let filteredGoods = [];
        const getFilteredGoods = () => {
            searchIndexes.forEach((index) => {
                filteredGoods.push(goods.rows[index])
            })
        }
        getFilteredGoods()

            if(filteredGoods.length > 0) {
                res.json(filteredGoods)
            } else {
                res.json([])
            }
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
        
    }
    async sortGoodsOnAllParameters(req, res) {
        const {parameters} = req.params;
        const parametersInt = parameters.replaceAll(',', '')
        let parametersArray = [];
        for(let i=0; i < parametersInt.length; i++) {
            parametersArray.push(parametersInt[i])
        }
        try {
        const goods = await db.query(`SELECT * FROM goods`)
        let searchIndexes = []
        const getIndexesArray = () => {
            goods.rows.forEach((row, i) => {
                for(let j=0; j < row.parameter.length; j++) {
                    row.parameter[j] == parametersArray[j]
                    if((row.parameter[j] == parametersArray[j]) && (parametersArray[j] == 1)) {
                       return searchIndexes.push(i)
                    } 
                }
            })
        } 
        getIndexesArray()

        let filteredGoods = [];
        const getFilteredGoods = () => {
            searchIndexes.forEach((index) => {
                filteredGoods.push(goods.rows[index])
            })
        }
        getFilteredGoods()

            if(filteredGoods.length > 0) {
                res.json(filteredGoods)
            } else {
                res.json([])
            }
        } catch(e) {
            return res.status(404).json({message: e.message})
        }
        
    } 
}

module.exports = new GoodsController();