const db = require('../db');
const keys = require('./../config/keys');
const fs = require('fs');

class PersonController {
	async createPerson(req, res) {
		try {
			const { name, descr, watsapp, email } = req.body;
			const imageSrc = req.file.filename;
			const newPerson = await db.query(
				`INSERT INTO persons (imageSrc, name, descr, watsapp, email) values ($1, $2, $3, $4, $5) RETURNING *`,
				[imageSrc, name, descr, watsapp, email],
			);
			res.json(newPerson.rows[0]);
		} catch (e) {
			return res.status(400).json({ message: e.message });
		}
	}
	async getAllPersons(req, res) {
		try {
			const persons = await db.query(`SELECT * FROM persons`);
			res.json(persons.rows);
		} catch (e) {
			return res.status(404).json({ message: e.message });
		}
	}

	async getPaginationPersons(req, res) {
		const page = req.params.page;
		const limit = 5;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		try {
			const persons = await db.query(`SELECT * FROM persons`);
			const result = persons.rows.slice(startIndex, endIndex);
			const totalPages = Math.ceil(persons.rows.length / limit);
			res.json({ result: result, pages: totalPages });
		} catch (e) {
			return res.status(404).json({ message: e.message });
		}
	}

	async getSearchPersons(req, res) {
		const string = req.params.string;
		try {
			const persons = await db.query(`SELECT * FROM persons`);
			let result = [];
			persons.rows.forEach((item) => {
				if (item.name.toLowerCase().includes(string.toLowerCase())) {
					result.push(item);
				}
			});
			res.json(result);
		} catch (e) {
			return res.status(404).json({ message: e.message });
		}
	}

	async getOnePerson(req, res) {
		const id = req.params.id;
		try {
			const person = await db.query(
				`SELECT * FROM persons where id = $1`,
				[id],
			);

			res.json(person.rows[0]);
		} catch (e) {
			return res.status(404).json({ message: e.message });
		}
	}

	async updatePerson(req, res) {
		const { name, descr, watsapp, email, id } = req.body;
		const file = req.file;
	
		try {
			// Получаем текущие данные человека
			const personFile = await db.query(`SELECT * FROM persons WHERE id = $1`, [id]);
			
			if (personFile.rows.length === 0) {
				return res.status(404).json({ message: 'Person not found' });
			}
	
			// Удаляем старое изображение, если есть новое
			if (file) {
				fs.unlink(`${keys.del_url}${personFile.rows[0].imagesrc}`, (err) => {
					if (err) console.log(err);
					console.log('Old image deleted successfully');
				});
			}
	
			// Обновляем данные
			const imageSrc = file ? req.file.filename : personFile.rows[0].imagesrc; // Используем новое изображение или сохраняем старое
	
			const updatedPerson = await db.query(
				`UPDATE persons SET imageSrc = $1, name = $2, descr = $3, watsapp = $4, email = $5 WHERE id = $6 RETURNING *`,
				[imageSrc, name, descr, watsapp, email, id]
			);
			
			return res.json(updatedPerson.rows[0]);
	
		} catch (e) {
			console.error('Error updating person:', e.message);
			return res.status(500).json({ message: 'Internal server error', error: e.message });
		}
	}
	

	async deletePerson(req, res) {
		const id = req.params.id;
		try {
			const personFile = await db.query(
				`SELECT * FROM persons where id = $1`,
				[id],
			);
			fs.unlink(
				`${keys.del_url}${personFile.rows[0].imagesrc}`,
				function (err) {
					if (err) return console.log(err);
				},
			);
			const person = await db.query(`DELETE FROM persons where id = $1`, [
				id,
			]);
			res.json(person.rows[0]);
		} catch (e) {
			return res.status(404).json({ message: e.message });
		}
	}
}

module.exports = new PersonController();
