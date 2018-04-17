"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const SQL = require('../model/SQL.class.js');
let sql = new SQL;

router.get('/', (req, res, next) => {
	let more = "";

	if (req.query.page != undefined) {
		more = " limit 50 offset " + 50*req.query.page;
	}

	sql.select('*', 'films', {}, {}, {}, more).then((rend) => {
		res.send({ rend });
	}).catch((err) => {console.log(err);});
});

router.post('/', (req, res, next) => {
	sql.select('*', 'films', {}, { imdb_id: req.body.imdb_id }).then((result) => {
		if (result.length == 0) {
			sql.insert('films', req.body).then((result) => {
				res.send({ result: result });
			}).catch((err) => {console.log(err);});
		} else {
			res.send({ error: "film deja present en bdd" });
		}
	}).catch((err) => {console.log(err);});
});

router.put('/', (req, res, next) => {
	sql.select('*', 'films', {}, { id: req.body.id }).then((result) => {
		if (result.length == 0) {
			res.send({ error: "film absent en bdd" });
		} else {
			sql.update('films', 'imdb_id', req.body.imdb_id, req.body).then((result) => {
				res.send({ result: result });
			}).catch((err) => {console.log(err);});
		}
	}).catch((err) => {console.log(err);});
});

router.delete('/', (req, res, next) => {
	sql.select('*', 'films', {}, { id: req.body.id }).then((result) => {
		if (result.length == 0) {
			res.send({ error: "film absent en bdd" });
		} else {
			sql.delete('films', 'imdb_id', req.body.imdb_id).then((result) => {
				res.send({ result: result });
			}).catch((err) => {console.log(err);});
		}
	}).catch((err) => {console.log(err);});
});

module.exports = router;
