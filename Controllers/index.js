"use strict";

const express				=	require('express');
const router				=	express.Router();
const session				=	require("express-session");

router.get('/', (req, res, next) => {
	if (req.session && req.session.id_user)
		return (res.render('connected/index', {title: 'Accueil'} ))
	else
		return (res.render("connected/index", {title: 'Accueil'} ));
});

module.exports = router;