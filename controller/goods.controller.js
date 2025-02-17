const db = require('../db');
const errorHandler = require('../utils/errorHandler');
const keys = require('./../config/keys');
const fs = require('fs');

// const keys = require('../config/keys')

class GoodsController {
    async createGood(req, res) {
        const {
            material,
            parameter,
            mainParameter,
            recommendparameter,
            article,
            thickness,
            volume,
            pcs,
            baseType,
            color,
            heatResistance,
            name,
            description,
            type,
            size,
            brand,
            linerType,
            dencity,
            typeGlue,
            advantages,
        } = req.body;

        const carouselImages = req.files.goodsCarouselImages;

        let goodsCarouselImages = [];
        carouselImages.map((file, index) => {
            goodsCarouselImages.push(`${file.filename}`);
        });


        const imageUrl = `${req.files.imageUrl[0].filename}`;
        if (!imageUrl) {
            return res
                .status(400)
                .json({ message: 'Пожалуйста, загрузите картинку' });
        }

        const pdfUrl = `${req.files.pdfUrl[0].filename}`;
        if (!pdfUrl) {
            return res
                .status(400)
                .json({ message: 'Пожалуйста, загрузите файл' });
        }

        try {
            const newGood = await db.query(
                `INSERT INTO goods (material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, goodsCarouselImages, imageUrl, pdfUrl, typeGlue, advantages, recommendparameter) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`,
                [
                    material,
                    parameter,
                    mainParameter,
                    article,
                    thickness,
                    volume,
                    pcs,
                    baseType,
                    color,
                    heatResistance,
                    name,
                    description,
                    type,
                    size,
                    brand,
                    linerType,
                    dencity,
                    goodsCarouselImages,
                    imageUrl,
                    pdfUrl,
                    typeGlue,
                    advantages,
                    recommendparameter
                ],
            );

            return res.json(newGood.rows[0]);
        } catch (e) {
            errorHandler(res, e);
        }
    }

    async getAllGoods(req, res) {
        try {
            const goods = await db.query(`SELECT * FROM goods`);
            res.json(goods.rows);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getOneGood(req, res) {
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

    async getPaginationGoods(req, res) {
        const { page } = req.params;
        const limit = 5;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {
            const goods = await db.query(`SELECT * FROM goods`);
            const result = goods.rows.slice(startIndex, endIndex);
            const totalPages = Math.ceil(goods.rows.length / limit);
            res.json({ result: result, pages: totalPages });
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async getSearchGoods(req, res) {
        const string = req.params.string;

        try {
            const news = await db.query(`SELECT * FROM goods`);

            let result = [];
            news.rows.forEach((item) => {
                if (
                    item.name.toLowerCase().includes(string.toLowerCase()) ||
                    item.description
                        .toLowerCase()
                        .includes(string.toLowerCase())
                ) {
                    result.push(item);
                }
            });
            res.json(result);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

   
    async updateGoods(req, res) {
        const {
            material,
            parameter,
            mainParameter,
            article,
            thickness,
            volume,
            pcs,
            baseType,
            color,
            heatResistance,
            name,
            description,
            type,
            size,
            brand,
            linerType,
            dencity,
            typeGlue,
            id,
            advantages,
            recommendparameter
        } = req.body;
    
        const files = req.files;
    
        try {
            // Получаем текущие данные товара
            const currentGoods = await db.query(`SELECT * FROM goods WHERE id = $1`, [id]);
            
            if (currentGoods.rows.length === 0) {
                return res.status(404).json({ message: 'Goods not found' });
            }
    
            // Удаляем старые изображения, если они есть
            const deleteFiles = (filesArray) => {
                filesArray.forEach((item) => {
                    fs.unlink(`${keys.del_url}${item}`, (err) => {
                        if (err) console.log(err);
                    });
                });
            };
    
            if (files.goodsCarouselImages && files.goodsCarouselImages.length > 0) {
                deleteFiles(currentGoods.rows[0].goodspersonalimages);
                const goodsCarouselImages = files.goodsCarouselImages.map(file => file.filename);
                await db.query(`UPDATE goods SET goodsCarouselImages = $1 WHERE id = $2`, [goodsCarouselImages, id]);
            }
    
            // Обновляем основные параметры товара
            const updates = [
                material || currentGoods.rows[0].material,
                parameter || currentGoods.rows[0].parameter,
                mainParameter || currentGoods.rows[0].mainparameter,
                article || currentGoods.rows[0].article,
                thickness || currentGoods.rows[0].thickness,
                volume || currentGoods.rows[0].volume,
                pcs || currentGoods.rows[0].pcs,
                baseType || currentGoods.rows[0].basetype,
                color || currentGoods.rows[0].color,
                heatResistance || currentGoods.rows[0].heatresistance,
                name || currentGoods.rows[0].name,
                description || currentGoods.rows[0].description,
                type || currentGoods.rows[0].type,
                size || currentGoods.rows[0].size,
                brand || currentGoods.rows[0].brand,
                linerType || currentGoods.rows[0].linertype,
                dencity || currentGoods.rows[0].dencity,
                typeGlue || currentGoods.rows[0].typeglue,
                advantages || currentGoods.rows[0].advantages,
                recommendparameter || currentGoods.rows[0].recommendparameter
            ];
    
            // Обработка URL изображения
            if (files.imageUrl && files.imageUrl.length > 0) {
                fs.unlink(`${keys.del_url}${currentGoods.rows[0].imageurl}`, (err) => {
                    if (err) console.log(err);
                    console.log('Image URL deleted successfully');
                });
                updates.push(files.imageUrl[0].filename);
            } else {
                updates.push(currentGoods.rows[0].imageurl); // Сохраняем старое значение
            }
    
            // Обработка URL PDF
            if (files.pdfUrl && files.pdfUrl.length > 0) {
                fs.unlink(`${keys.del_url}${currentGoods.rows[0].pdfurl}`, (err) => {
                    if (err) console.log(err);
                    console.log('PDF URL deleted successfully');
                });
                updates.push(files.pdfUrl[0].filename);
            } else {
                updates.push(currentGoods.rows[0].pdfurl); // Сохраняем старое значение
            }
    
            // Обновляем товар в базе данных
            const updatedGoods = await db.query(
                `UPDATE goods SET material = $1, parameter = $2, mainParameter = $3, article = $4, thickness = $5, volume = $6, pcs = $7, baseType = $8, color = $9, heatResistance = $10, name = $11, description = $12, type = $13, size = $14, brand = $15, linerType = $16, dencity = $17, typeGlue = $18, advantages = $19, recommendparameter = $20, imageUrl = $21, pdfUrl = $22 WHERE id = $23 RETURNING *`,
                [...updates, id]
            );
    
            return res.json(updatedGoods.rows[0]);
    
        } catch (e) {
            console.error("Error updating goods:", e); // Логируем ошибку на сервере
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    
    async deleteGood(req, res) {
        const { id } = req.params;
        try {
            const goods = await db.query(`DELETE FROM goods where id = $1`, [
                id,
            ]);
            res.json(goods.rows[0]);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async sortGoodsOnMainParameters(req, res) {
        const { main } = req.params;
        try {
            const mainInt = (main || '').replace(/,/g, ''); // Handles undefined
            let mainArray = mainInt.split('');

            const goods = await db.query(`SELECT * FROM goods`);
            let searchIndexes = [];

            goods.rows.forEach((row, i) => {
                if (
                    row.mainparameter &&
                    row.mainparameter.length >= mainArray.length
                ) {
                    for (let j = 0; j < row.mainparameter.length; j++) {
                        if (
                            row.mainparameter[j] == mainArray[j] &&
                            mainArray[j] == '1'
                        ) {
                            searchIndexes.push(i);
                            break; // Stop further searching once a match is found
                        }
                    }
                }
            });

            let filteredGoods = searchIndexes.map((index) => goods.rows[index]);

            res.json(filteredGoods);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async sortGoodsOnRecommendParameters(req, res) {
        const { recommend } = req.params;
        try {
            const recommendInt = (recommend || '').replace(/,/g, ''); // Handles undefined
            let recommendArray = recommendInt.split('');

            const goods = await db.query(`SELECT * FROM goods`);
            let searchIndexes = [];

            goods.rows.forEach((row, i) => {
                if (
                    row.recommendparameter &&
                    row.recommendparameter.length >= recommendArray.length
                ) {
                    for (let j = 0; j < row.recommendparameter.length; j++) {
                        if (
                            row.recommendparameter[j] == recommendArray[j] &&
                            recommendArray[j] == '1'
                        ) {
                            searchIndexes.push(i);
                            break; // Stop further searching once a match is found
                        }
                    }
                }
            });

            let filteredGoods = searchIndexes.map((index) => goods.rows[index]);

            res.json(filteredGoods);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }

    async sortGoodsOnAllParameters(req, res) {
        const { parameters } = req.params;

        console.log(
            'Тип входящих данных в sortGoodsOnAllParameters: ',
            typeof parameters,
            parameters,
        );

        try {
            const parametersInt = (parameters || '').replace(/,/g, '');
            let parametersArray = parametersInt.split('');

            const goods = await db.query(`SELECT * FROM goods`);
            let searchIndexes = [];

            goods.rows.forEach((row, i) => {
                if (
                    row.parameter &&
                    row.parameter.length >= parametersArray.length
                ) {
                    for (let j = 0; j < row.parameter.length; j++) {
                        if (
                            row.parameter[j] == parametersArray[j] &&
                            parametersArray[j] == '1'
                        ) {
                            searchIndexes.push(i);
                            break;
                        }
                    }
                }
            });

            let filteredGoods = searchIndexes.map((index) => goods.rows[index]);

            res.json(filteredGoods);
        } catch (e) {
            return res.status(404).json({ message: e.message });
        }
    }
}

module.exports = new GoodsController();
