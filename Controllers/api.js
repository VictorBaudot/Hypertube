"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const SQL = require('../model/SQL.class.js');
let sql = new SQL;
const token = "kb90dQbxzq0397352800";

router.get('/', (req, res, next) => {
	if (req.query.token == token) {
		let more = "";
		if (req.query.page != undefined) {
			more = " limit 50 offset " + (50 * (req.query.page - 1));
		}
		sql.select('*', 'films', {}, {}, {}, more).then((films) => {
			res.send({ films });
		}).catch((err) => {console.log(err);});
	} else {
		res.send({ "error" : "bad token" });
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
