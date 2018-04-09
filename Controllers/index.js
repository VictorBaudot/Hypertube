"use strict";

const express				=	require('express');
const router				=	express.Router();
const SQL					=	require('../Model/SQL.class.js');
const htmlspecialchars		=	require("htmlspecialchars");
const session				=	require("express-session");
const crypto 				=	require('crypto');


router.get('/', (req, res, next) => {
	if (req.session.id)
		return (res.render('index'))
	else
		return (res.render('connexion'));
});

router.post('/connexion', (req, res, next) => {
	let params = req.body;

	if (params.login && params.psswd)
	{
		let sql = new SQL();
		sql.select('id', 'user', {
			login: htmlspecialchars(params.login),
			psswd: crypto.createHash('md5').update(htmlspecialchars(params.psswd)).digest('hex')
		}).then(result => {
			if (Object.keys(result).length > 0)
			{
				req.session.id = result[0].id;
				return (res.redirect('/index'));
			}
			else
			{
				// Alors retourner un message d'erreur
			}
		});
	}
	else
		console.log("Error from params");
	return (res);
});

module.exports = router;