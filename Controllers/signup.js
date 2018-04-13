"use strict";

const express	=	require('express');
const router = express.Router();

module.exports = (passport) => {
	router.post('/', checkCredentials, passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true, // allow flash messages
		session: false // prevent auto-login
	}));
	return router;
}

function checkCredentials(req, res, next) {
	console.log(req.body)
	let {login, first_name, last_name, email, password, psswd_confirm} = req.body
	if (login && first_name && last_name && email && password && psswd_confirm) return next();

	req.flashAdd('tabError', 'Tous les champs ne sont pas remplis.');
	res.redirect('/');
}