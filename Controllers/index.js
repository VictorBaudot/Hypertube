"use strict";

const express				=	require('express');
const router				=	express.Router();
const session				=	require("express-session");

router.get('/', (req, res, next) => {
	if (req.session && req.session.id)
		return (res.render('index'))
	else
		return (res.redirect('/connexion'));
});

module.exports = router;