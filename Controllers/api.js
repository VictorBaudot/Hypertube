"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const Popcorn = require('../Model/Popcorn.js');
const Imdb = require('../Model/Imdb.js');

function getAllInfo(films)
{
	let imdb = new Imdb;
	var new_films = [];
	let	i = 0;

	return new Promise((resolve, reject) => {
		films.forEach((film, index) => {
			imdb.getById(film.imdb_id).then((res) => {
				res.rating = film.rating.percentage/10;
				new_films.push(res);
				if (new_films.length == films.length)
					resolve(new_films)
			});
		});
	});
}

router.get('/', (req, res, next) => {
	let pop = new Popcorn;
	let promise = pop.getOnePage(1);

	promise.then((films) => {
		getAllInfo(films).then((new_films) => {
			new_films.sort((a, b) => { return b.rating-a.rating; })
			res.send({ films: new_films });
		})
	}).catch((err) => { console.log(err); });
});

module.exports = router;
