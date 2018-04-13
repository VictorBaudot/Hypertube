"use strict";

const express				=	require('express');
const router				=	express.Router();

module.exports = (passport) => {
	router.get('/', (req, res, next) => {
		if (req.isAuthenticated()) {
			res.render("connected/index", {title: 'Accueil'})
		} else res.render("not_connected/index")
	});
	return router;
}