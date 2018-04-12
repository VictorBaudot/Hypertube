"use strict";

const express				=	require('express');
const router				=	express.Router();
const htmlspecialchars		=	require("htmlspecialchars");
const crypto 				=	require('crypto');
const SQL					=	require('../Model/SQL.class.js');

router.get('/', (req, res, next) => {
	res.render('inscription', {error : false });
});

router.post('/', (req, res, next) => {
	let params = req.body;

	if (params.login && params.psswd && params.psswd_confirm && params.email)
	{
		let login = htmlspecialchars(params.login);
		let psswd = htmlspecialchars(params.psswd);
		let psswd_confirm = htmlspecialchars(params.psswd_confirm);
		let email = htmlspecialchars(params.email);

		if (psswd == psswd_confirm)
		{
			let sql = new SQL();
			sql.select('login', 'users', {
				login: login
			}).then(result => {
				if (Object.keys(result).length)
				{
					return (res.render('inscription', {
						error: "Votre login est deja prit :("
					}));					
				}
				else
				{
					sql.insert('users', {
						login: login,
						psswd: crypto.createHash('md5').update(psswd).digest('hex'),
						email: email
					}).then(result => {
						if (result && result.affectedRows == 1)
						{
							return (res.redirect('/connexion'));							
						}
						else
						{
							return (res.render('inscription', {
								error: "Une erreur est survenu lors de votre inscription :("
							}));
						}
					});					
				}
			});
		}
		else
			return (res.render('inscription', {
						error: "Vos mots de passe ne correspondent pas"
					}));
	}
	else
		return (res.render('inscription', {
					error: "Veuillez remplir tous les champs !"
				}));
});

module.exports = router;