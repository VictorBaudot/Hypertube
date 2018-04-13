"use strict";

const express				=	require('express');
const router				=	express.Router();
const session				=	require("express-session");

module.exports = (passport) => {
	router.get('/', (req, res, next) => {
		res.render('connected/profile/index', {title: 'Profil', user: req.user});
	})
	return router;
}