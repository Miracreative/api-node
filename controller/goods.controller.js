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

        const personalImages = req.files.goodsPersonalImages;

        let goodsPersonalImages = [];
        personalImages.map((file, index) => {
            goodsPersonalImages.push(`${file.filename}`);
        });

        const industrialImages = req.files.goodsIndustrialImages;

        let goodsIndustrialImages = [];
        industrialImages.map((file, index) => {
            goodsIndustrialImages.push(`${file.filename}`);
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
                `INSERT INTO goods (material, parameter, mainParameter, article, thickness, volume, pcs, baseType, color, heatResistance, name, description, type, size, brand, linerType, dencity, goodsPersonalImages, goodsIndustrialImages, imageUrl, pdfUrl, typeGlue, advantages, recommendparameter) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`,
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
                    goodsPersonalImages,
                    goodsIndustrialImages,
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

    // async updateGoods(req, res) {
    //     const {
    //         material,
    //         parameter,
    //         mainParameter,
    //         article,
    //         thickness,
    //         volume,
    //         pcs,
    //         baseType,
    //         color,
    //         heatResistance,
    //         name,
    //         description,
    //         type,
    //         size,
    //         brand,
    //         linerType,
    //         dencity,
    //         typeGlue,
    //         id,
    //         advantages,
    //         recommendparameter
    //     } = req.body;

    //     const files = req.files;
    //     if (!files[0]) {
    //         const goods = await db.query(
    //             `UPDATE goods SET  material = $1, parameter = $2, mainParameter = $3, article = $4, thickness = $5, volume = $6, pcs = $7, baseType = $8, color = $9, heatResistance = $10, name = $11, description = $12, type = $13, size = $14, brand = $15, linerType = $16, dencity = $17, typeGlue = $18, advantages = $19, recommendparameter = $20 where id = $21 RETURNING *`,
    //             [
    //                 material,
    //                 parameter,
    //                 mainParameter,
    //                 article,
    //                 thickness,
    //                 volume,
    //                 pcs,
    //                 baseType,
    //                 color,
    //                 heatResistance,
    //                 name,
    //                 description,
    //                 type,
    //                 size,
    //                 brand,
    //                 linerType,
    //                 dencity,
    //                 typeGlue,
    //                 advantages,
    //                 recommendparameter,
    //                 id,
    //             ],
    //         );
    //         res.json(goods.rows[0]);
    //     } else {
            
    //         const personalImages = req.files.goodsPersonalImages;
    //         if (personalImages.length > 0) {
    //             const personalImagesFiles = await db.query(
    //                 `SELECT * FROM goods where id = $1`,
    //                 [id],
    //             );

    //             personalImagesFiles.rows[0].goodspersonalimages.forEach((item) => {
    //                 fs.unlink(`${keys.del_url}${item}`, function (err) {
    //                     if (err) return console.log(err);
    //                     console.log('file deleted successfully');
    //                 });
    //             });
    //             let goodsPersonalImages = [];
    //             personalImages.map((file, index) => {
    //                 goodsPersonalImages.push(file.filename);
    //             });
    //             const goods = await db.query(
    //                 `UPDATE goods SET  goodsPersonalImages = $1 where id = $2 RETURNING *`,
    //                 [
    //                     goodsPersonalImages,
    //                     id,
    //                 ],
    //             );
    //             res.json(goods.rows[0]);
    //         }

    //         const industrialImages = req.files.goodsIndustrialImages;
    //         if (industrialImages.length > 0) {

    //             const industrialImagesFiles = await db.query(
    //                 `SELECT * FROM goods where id = $1`,
    //                 [id],
    //             );

    //             industrialImagesFiles.rows[0].goodsindustrialimages.forEach((item) => {
    //                 fs.unlink(`${keys.del_url}${item}`, function (err) {
    //                     if (err) return console.log(err);
    //                     console.log('file deleted successfully');
    //                 });
    //             });
    //             let goodsIndustrialImages = [];
    //             industrialImages.map((file, index) => {
    //                 goodsIndustrialImages.push(file.filename);
    //             });
    //             const goods = await db.query(
    //                 `UPDATE goods SET  goodsIndustrialImages = $1 where id = $2 RETURNING *`,
    //                 [
    //                     goodsIndustrialImages,
    //                     id,
    //                 ],
    //             );
    //             res.json(goods.rows[0]);
    //         }

    //         const imageUrl = `${req.files.imageUrl[0].filename}`;
    //         if (imageUrl) {
    //             const imageUrlFiles = await db.query(
    //                 `SELECT * FROM goods where id = $1`,
    //                 [id],
    //             );

    //             fs.unlink(
	// 				`${keys.del_url}${imageUrlFiles.rows[0].imageurl}`,
	// 				function (err) {
	// 					if (err) return console.log(err);
	// 				},
	// 			);
    //             const imageUrl = `${req.files.imageUrl[0].filename}`;
    //             const goods = await db.query(
    //                 `UPDATE goods SET  imageUrl = $1 where id = $2 RETURNING *`,
    //                 [
    //                     imageUrl,
    //                     id,
    //                 ],
    //             );
    //             res.json(goods.rows[0]);
    //         }

    //         const pdfUrl = `${req.files.pdfUrl[0].filename}`;
    //         if (pdfUrl) {
    //             try {
    //                 const pdfUrlFiles = await db.query(
    //                     `SELECT * FROM goods where id = $1`,
    //                     [id],
    //                 );
    
    //                 fs.unlink(
    //                     `${keys.del_url}${pdfUrlFiles.rows[0].pdfurl}`,
    //                     function (err) {
    //                         if (err) return console.log(err);
    //                     },
    //                 );
    //                 const pdfUrl = `${req.files.pdfUrl[0].filename}`;
    //                 const goods = await db.query(
    //                     `UPDATE goods SET pdfUrl = $1 where id = $2 RETURNING *`,
    //                     [
    //                         pdfUrl,
    //                         id,
    //                     ],
    //                 );
    //                 res.json(goods.rows[0]);
    //             } catch (e) {
    //                 return res.status(404).json({ message: e.message });
    //             }
    //         }
    //         res.json(goods.rows[0]);
    //     }
    // }
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
    
            if (files.goodsPersonalImages && files.goodsPersonalImages.length > 0) {
                deleteFiles(currentGoods.rows[0].goodspersonalimages);
                const goodsPersonalImages = files.goodsPersonalImages.map(file => file.filename);
                await db.query(`UPDATE goods SET goodsPersonalImages = $1 WHERE id = $2`, [goodsPersonalImages, id]);
            }
    
            if (files.goodsIndustrialImages && files.goodsIndustrialImages.length > 0) {
                deleteFiles(currentGoods.rows[0].goodsindustrialimages);
                const goodsIndustrialImages = files.goodsIndustrialImages.map(file => file.filename);
                await db.query(`UPDATE goods SET goodsIndustrialImages = $1 WHERE id = $2`, [goodsIndustrialImages, id]);
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

    //* Старая версия, не удалять! *//
    //////////////////////////////////

    // async sortGoodsOnMainParameters(req, res) {
    //     const { main } = req.params;
    //     const mainInt = main.replaceAll(',', '');
    //     let mainArray = [];
    //     for (let i = 0; i < mainInt.length; i++) {
    //         mainArray.push(mainInt[i]);
    //     }
    //     try {
    //         const goods = await db.query(`SELECT * FROM goods`);
    //         let searchIndexes = [];
    //         const getIndexesArray = () => {
    //             goods.rows.forEach((row, i) => {
    //                 for (let j = 0; j < row.mainparameter.length; j++) {
    //                     row.mainparameter[j] == mainArray[j];
    //                     if (
    //                         row.mainparameter[j] == mainArray[j] &&
    //                         mainArray[j] == 1
    //                     ) {
    //                         return searchIndexes.push(i);
    //                     }
    //                 }
    //             });
    //         };
    //         getIndexesArray();

    //         let filteredGoods = [];
    //         const getFilteredGoods = () => {
    //             searchIndexes.forEach((index) => {
    //                 filteredGoods.push(goods.rows[index]);
    //             });
    //         };
    //         getFilteredGoods();

    //         if (filteredGoods.length > 0) {
    //             res.json(filteredGoods);
    //         } else {
    //             res.json([]);
    //         }
    //     } catch (e) {
    //         return res.status(404).json({ message: e.message });
    //     }
    // }

    // async sortGoodsOnAllParameters(req, res) {
    //     const { parameters } = req.params;

    //     console.log(
    //         'Тип входящих данных в sortGoodsOnAllParameters: ',
    //         typeof parameters,
    //         parameters,
    //     );

    //     const parametersInt = parameters.replaceAll(',', '');
    //     let parametersArray = [];
    //     for (let i = 0; i < parametersInt.length; i++) {
    //         parametersArray.push(parametersInt[i]);
    //     }
    //     try {
    //         const goods = await db.query(`SELECT * FROM goods`);
    //         let searchIndexes = [];
    //         const getIndexesArray = () => {
    //             goods.rows.forEach((row, i) => {
    //                 for (let j = 0; j < row.parameter.length; j++) {
    //                     row.parameter[j] == parametersArray[j];
    //                     if (
    //                         row.parameter[j] == parametersArray[j] &&
    //                         parametersArray[j] == 1
    //                     ) {
    //                         return searchIndexes.push(i);
    //                     }
    //                 }
    //             });
    //         };
    //         getIndexesArray();

    //         let filteredGoods = [];
    //         const getFilteredGoods = () => {
    //             searchIndexes.forEach((index) => {
    //                 filteredGoods.push(goods.rows[index]);
    //             });
    //         };
    //         getFilteredGoods();

    //         if (filteredGoods.length > 0) {
    //             res.json(filteredGoods);
    //         } else {
    //             res.json([]);
    //         }
    //     } catch (e) {
    //         return res.status(404).json({ message: e.message });
    //     }
    // }

    // async sortGoodsOnMainParameters(req, res) {
    //     const { main } = req.params;

    //     console.log('Выясняем тип main', typeof main, main);

    //     // Проверяем, что main - это строка
    //     if (typeof main !== 'string') {
    //         return res
    //             .status(400)
    //             .json({ message: 'Неверный формат параметра main' });
    //     }

    //     // const mainInt = main.replaceAll(',', '');
    //     const mainInt = String(main).replaceAll(',', '');

    //     let mainArray = [];
    //     for (let i = 0; i < mainInt.length; i++) {
    //         mainArray.push(mainInt[i]);
    //     }

    //     try {
    //         const goods = await db.query(`SELECT * FROM goods`);
    //         let searchIndexes = [];
    //         const getIndexesArray = () => {
    //             goods.rows.forEach((row, i) => {
    //                 for (let j = 0; j < row.mainparameter.length; j++) {
    //                     row.mainparameter[j] == mainArray[j];
    //                     if (
    //                         row.mainparameter[j] == mainArray[j] &&
    //                         mainArray[j] == 1
    //                     ) {
    //                         return searchIndexes.push(i);
    //                     }
    //                 }
    //             });
    //         };
    //         getIndexesArray();

    //         let filteredGoods = [];
    //         const getFilteredGoods = () => {
    //             searchIndexes.forEach((index) => {
    //                 filteredGoods.push(goods.rows[index]);
    //             });
    //         };
    //         getFilteredGoods();

    //         if (filteredGoods.length > 0) {
    //             res.json(filteredGoods);
    //         } else {
    //             res.json([]);
    //         }
    //     } catch (e) {
    //         return res.status(404).json({ message: e.message });
    //     }
    // }

    // async sortGoodsOnAllParameters(req, res) {
    //     const { parameters } = req.params;
    //     const parametersInt = parameters.replaceAll(',', '');

    //     let parametersArray = [];
    //     for (let i = 0; i < parametersInt.length; i++) {
    //         parametersArray.push(parametersInt[i]);
    //     }

    //     try {
    //         const goods = await db.query(`SELECT * FROM goods`);
    //         let searchIndexes = [];
    //         const getIndexesArray = () => {
    //             goods.rows.forEach((row, i) => {
    //                 for (let j = 0; j < row.parameter.length; j++) {
    //                     row.parameter[j] == parametersArray[j];
    //                     if (
    //                         row.parameter[j] == parametersArray[j] &&
    //                         parametersArray[j] == 1
    //                     ) {
    //                         return searchIndexes.push(i);
    //                     }
    //                 }
    //             });
    //         };
    //         getIndexesArray();

    //         let filteredGoods = [];
    //         const getFilteredGoods = () => {
    //             searchIndexes.forEach((index) => {
    //                 filteredGoods.push(goods.rows[index]);
    //             });
    //         };
    //         getFilteredGoods();

    //         if (filteredGoods.length > 0) {
    //             res.json(filteredGoods);
    //         } else {
    //             res.json([]);
    //         }
    //     } catch (e) {
    //         return res.status(404).json({ message: e.message });
    //     }
    // }

    //////////////////////////////////
    //* Старая версия, не удалять! *//
}

module.exports = new GoodsController();
