"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const SQL = require('../Model/SQL.class.js');
let sql = new SQL;
const token = "kb90dQbxzq0397352800";

router.get('/', (req, res, next) => {
	let query = req.query
	let sortType = 'title'
	let sortOrder = 'DESC'
	let conditions = {}
	let between = ""
	console.log(req.query)
	if (query.token == token) {
		let more = "";
		if (query.page) {
			more = " LIMIT 30 OFFSET " + (30 * (query.page - 1));
		}
		if (query.sortType) sortType = query.sortType
		if (query.sortOrder) sortOrder = query.sortOrder
		if (query.ratingL && query.ratingU) between += " AND rating >= " + query.ratingL + " AND rating <= " + query.ratingU
		if (query.yearL && query.yearU) between += " AND year >= " + query.yearL + " AND year <= " + query.yearU
		if (query.genres) {
			let genres = query.genres.split(',')
			genres.forEach(genre => {
				between += " AND genre LIKE '%"+genre+"%'"
			});
		}
		if (query.directors) {
			let directors = query.directors.split(',')
			directors.forEach(director => {
				between += " AND director LIKE '%"+director+"%'"
			});
		}
		if (query.actors) {
			let actors = query.actors.split(',')
			actors.forEach(actor => {
				between += " AND actors LIKE '%"+actor+"%'"
			});
		}
		if (query.title) between += " AND title LIKE '%"+query.title+"%'"

		sql.select('*', 'films', {}, conditions, {col: sortType, order: sortOrder}, more, between).then((films) => {
			res.send({ films });
		}).catch((err) => {console.log(err);});
	} else {
		res.send({ "error" : "Token not valid" });
	}
});

router.post('/', (req, res, next) => {
	if (req.query.token == token) {
		sql.select('*', 'films', {}, { imdb_id: req.body.imdb_id }).then((result) => {
			if (result.length == 0) {
				sql.insert('films', req.body).then((result) => {
					res.send({ result });
				}).catch((err) => {console.log(err);});
			} else {
				res.send({ error: "film deja present en bdd" });
			}
		}).catch((err) => {console.log(err);});
	}
});

router.put('/', (req, res, next) => {
	if (req.query.token == token) {
		sql.select('*', 'films', {}, { id: req.body.id }).then((result) => {
			if (result.length == 0) {
				res.send({ error: "film absent en bdd" });
			} else {
				sql.update('films', 'imdb_id', req.body.imdb_id, req.body).then((result) => {
					res.send({ result });
				}).catch((err) => {console.log(err);});
			}
		}).catch((err) => {console.log(err);});
	}
});

router.delete('/', (req, res, next) => {
	if (req.query.token == token) {
		sql.select('*', 'films', {}, { id: req.body.id }).then((result) => {
			if (result.length == 0) {
				res.send({ error: "film absent en bdd" });
			} else {
				sql.delete('films', 'imdb_id', req.body.imdb_id).then((result) => {
					res.send({ result });
				}).catch((err) => {console.log(err);});
			}
		}).catch((err) => {console.log(err);});
	}
});

module.exports = router;
