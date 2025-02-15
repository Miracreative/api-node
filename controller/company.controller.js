const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');

class CompanyController {
	async createCompany(req, res) {
		try {

			const file = req.file.filename;
			const { fullName, shortName, actualAddress, postalAddress, legalAddress, director, phone, email, website, INN, KPP, OKPO, OGRN, OKVED, bankName, accountNumber, correspondentAccount, BIC } = req.body;
			const newCompany = await db.query(`INSERT INTO company (fullName,shortName, actualAddress, postalAddress, legalAddress, director, phone, email, website, INN, KPP, OKPO, OGRN, OKVED, bankName, accountNumber, correspondentAccount, BIC, file) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`, [fullName, shortName, actualAddress, postalAddress, legalAddress, director, phone, email, website, INN, KPP, OKPO, OGRN, OKVED, bankName, accountNumber, correspondentAccount, BIC, file])
			res.json(newCompany.rows[0])
		} catch (e) {
			return res.status(400).json({ message: e.message })
		}

	}

	async getAllCompany(req, res) {
		try {
			const company = await db.query(`SELECT * FROM company`)
			res.json(company.rows)
		} catch (e) {
			return res.status(404).json({ message: e.message })
		}

	}

	async updateCompany(req, res) {
		const { fullName, shortName, actualAddress, postalAddress, legalAddress, director, phone, email, website, INN, KPP, OKPO, OGRN, OKVED, bankName, accountNumber, correspondentAccount, BIC, id } = req.body;

		const fileExist = req.file;
		if (!fileExist) {
			try {
				const company = await db.query(`UPDATE company SET fullName = $1, shortName = $2, actualAddress = $3, postalAddress = $4, legalAddress = $5, director = $6, phone = $7, email = $8, website = $9, INN = $10, KPP = $11, OKPO = $12, OGRN = $13, OKVED = $14, bankName = $15, accountNumber = $16, correspondentAccount = $17, BIC = $18 where id = $19 RETURNING *`, [fullName, shortName, actualAddress, postalAddress, legalAddress, director, phone, email, website, INN, KPP, OKPO, OGRN, OKVED, bankName, accountNumber, correspondentAccount, BIC, id])
				res.json(company.rows[0])
			} catch (e) {
				return res.status(404).json({ message: e.message })
			}
		} else {
			try {
				const companyFile = await db.query(
					`SELECT * FROM company where id = $1`,
					[id],
				);
				fs.unlink(
					`${keys.del_url}${companyFile.rows[0].file}`,
					function (err) {
						if (err) return console.log(err);
					},
				);
				const file = req.file.filename;
				const company = await db.query(`UPDATE company SET fullName = $1, shortName = $2, actualAddress = $3, postalAddress = $4, legalAddress = $5, director = $6, phone = $7, email = $8, website = $9, INN = $10, KPP = $11, OKPO = $12, OGRN = $13, OKVED = $14, bankName = $15, accountNumber = $16, correspondentAccount = $17, BIC = $18, file = $19 where id = $20 RETURNING *`, [fullName, shortName, actualAddress, postalAddress, legalAddress, director, phone, email, website, INN, KPP, OKPO, OGRN, OKVED, bankName, accountNumber, correspondentAccount, BIC, file, id])

				res.json(company.rows[0])
				} catch(e) {
					return res.status(404).json({ message: e.message })
                }
			}
		
	}

	async deleteCompany(req, res) {
		const id = req.params.id;  // Получаем ID компании из параметров запроса
		const client = await db.connect(); // Получаем клиент для транзакции
	
		try {
			await client.query('BEGIN'); // Начало транзакции
	
			// 1. Проверяем, существует ли компания
			const companyExists = await client.query(`SELECT id FROM company WHERE id = $1`, [id]);
	
			if (companyExists.rows.length === 0) {
				await client.query('ROLLBACK'); // Откат транзакции
				return res.status(404).json({ message: 'Company not found' });
			}
	
			// 2. Удаляем компанию
			const result = await client.query(`DELETE FROM company WHERE id = $1`, [id]);
	
			// 3. Проверяем, было ли удалено какое-либо количество строк
			if (result.rowCount === 1) {
				await client.query('COMMIT'); // Подтверждаем транзакцию
				return res.status(200).json({ message: 'Company deleted successfully' });
			} else {
				await client.query('ROLLBACK'); // Откат транзакции
				return res.status(500).json({ message: 'Failed to delete company (unknown error)' });
			}
	
		} catch (e) {
			await client.query('ROLLBACK'); // Откат транзакции в случае ошибки
			console.error("Error deleting company:", e);  // Логируем ошибку на сервере
			return res.status(500).json({ message: 'Internal server error' }); // Сообщение для клиента
		} finally {
			client.release(); // Возвращаем клиент в пул
		}
	}
	

}

module.exports = new CompanyController();