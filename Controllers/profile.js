"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();

router.get('/', (req, res, next) => {
	res.render('connected/profile/index', { title: 'Profil', user: req.user, i18n: res });
})

module.exports = router;
