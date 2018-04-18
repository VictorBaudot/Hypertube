"use strict";

const express	=	require('express');
const router	=	express.Router();

module.exports = (passport) => {
	router.post('/', checkCredentials, passport.authenticate('local-signin', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/', // redirect back to the signup page if there is an error
		failureFlash: true, // allow flash messages
	}), ({ body, session }, res) => {
		if (body.remember) session.cookie.maxAge = 1000 * 60 * 3;
		else session.cookie.expires = false;
		res.json({ loggedin: true });
		res.redirect('/');
	});
	return router
}

function checkCredentials(req, res, next) {
	// console.log(req.body)
	if (req.body.login && req.body.password) return next();

	req.flashAdd('tabError', 'Login / Mot de passe invalides');
	res.redirect('/');
}