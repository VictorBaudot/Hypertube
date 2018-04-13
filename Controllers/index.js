"use strict";

const express				=	require('express');
const router				=	express.Router();
const session				=	require("express-session");

router.get('/', (req, res, next) => {
	if (req.isAuthenticated()) {
		res.render("not_connected/index", {title: 'Accueil'})
	} else res.render("not_connected/index")
});

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated()) return next();

	res.redirect('/');
}

module.exports = router;