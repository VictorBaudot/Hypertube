"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('connected/profile/index', { title: 'Profil', user: req.user });
})

module.exports = router;