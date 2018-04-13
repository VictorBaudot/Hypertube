"use strict";

const express				=	require('express');
const router				=	express.Router();
const session				=	require("express-session");

router.get('/', (req, res, next) => {
	res.render('connected/profile/index', {title: 'Profil'});
})

module.exports = router