"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const Popcorn = require('../Model/Popcorn.js');

router.get('/', (req, res, next) => {
	let pop = new Popcorn;
	let films = pop.getOnePage(1);
	films.then((films) => {
		console.log(films);
		res.render('not_connected/rating', { films, i18n: res });
	})
});

module.exports = router;
