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
				if (item.title.toLowerCase().includes(string.toLowerCase())) {
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
		if (!file) {
			try {
				const person = await db.query(
					`UPDATE persons SET name = $1, descr = $2, watsapp = $3, email = $4 where id = $5 RETURNING *`,
					[name, descr, watsapp, email, id],
				);
				res.json(person.rows[0]);
			} catch (e) {
				return res.status(404).json({ message: e.message });
			}
		} else {
			try {
				// console.log(req.file)
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
				const imageSrc = req.file.filename;
				const person = await db.query(
					`UPDATE persons SET imageSrc = $1, name = $2, descr = $3, watsapp = $4, email = $5 where id = $6 RETURNING *`,
					[imageSrc, name, descr, watsapp, email, id],
				);
				res.json(person.rows[0]);
			} catch (e) {
				return res.status(404).json({ message: e.message });
			}
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
