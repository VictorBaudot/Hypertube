"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const Api	= require('../Model/Api.js');

router.get('/', (req, res, next) => {
	let api = new Api;

	api.get(1).then((body) => {
		res.render('not_connected/rating', { films: body.films, i18n: res });
	}).catch((err) => { console.log(err); });
});

module.exports = router;
