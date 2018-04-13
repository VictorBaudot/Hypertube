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

	if (params.login && params.passwd && params.passwd_confirm && params.email && params.first_name && params.last_name)
	{
		let login = htmlspecialchars(params.login);
		let passwd = htmlspecialchars(params.passwd);
		let passwd_confirm = htmlspecialchars(params.passwd_confirm);
		let email = htmlspecialchars(params.email);
		let	first_name = htmlspecialchars(params.first_name);
		let	last_name = htmlspecialchars(params.last_name);

		if (passwd == passwd_confirm)
		{
			let sql = new SQL();
			sql.select('login', 'user', {
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
					sql.insert('user', {
						login: login,
						passwd: crypto.createHash('md5').update(passwd).digest('hex'),
						email: email,
						first_name: first_name,
						last_name: last_name
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
