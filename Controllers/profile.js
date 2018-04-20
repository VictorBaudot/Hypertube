"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();

router.get('/', (req, res, next) => {
	if (req.session.lang == undefined && req.session.passport.user) {
		sql.select('*', 'users', {}, { id: req.session.passport.user }).then(result => {
			req.session.lang = result[0].lang;
			res.redirect('/profile');
		});
	} else {
		res.cookie('i18n', req.session.lang);
		res.render('connected/profile/index', { title: 'Profil', user: req.user, i18n: res });
	}
})

module.exports = router;
