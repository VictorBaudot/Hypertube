"use strict";

const express				=	require('express');
const router				=	express.Router();
const htmlspecialchars		=	require("htmlspecialchars");
const crypto 				=	require('crypto');
const SQL					=	require('../Model/SQL.class.js');

router.get('/', (req, res, next) => {
	res.cookie('i18n', 'fr');
	res.render('not_connected/index', {error : false, i18n: res });
});

router.post('/', (req, res, next) => {
	let params = req.body;

	if (params.login && params.psswd && params.psswd_confirm && params.email && params.first_name && params.last_name)
	{
		let login = htmlspecialchars(params.login);
		let psswd = htmlspecialchars(params.psswd);
		let psswd_confirm = htmlspecialchars(params.psswd_confirm);
		let email = htmlspecialchars(params.email);
		let	first_name = htmlspecialchars(params.first_name);
		let	last_name = htmlspecialchars(params.last_name);

		if (psswd == psswd_confirm)
		{
			let sql = new SQL();
			sql.select('login', 'users', {
				login: login
			}).then(result => {
				if (Object.keys(result).length)
				{
					return (res.render('not_connected/index', {
						error: "Votre login est deja prit :(",
						i18n: res
					}));
				}
				else
				{
					let i = 0, minus = 0, maj = 0, num = 0, c = psswd;
					while (c[i])
					{
						if ((c[i] >= 'a') && (c[i] <= 'z'))
							minus = 1;
						if ((c[i] >= 'A') && (c[i] <= 'Z'))
							maj = 1;
						if ((c[i] >= '0') && (c[i] <= '9'))
							num = 1;
						i++;
					}
					if (c.length >= 8 && minus && maj && num) {
						sql.insert('users', {
							login: login,
							psswd: crypto.createHash('md5').update(psswd).digest('hex'),
							email: email,
							first_name: first_name,
							last_name: last_name
						}).then(result => {
							if (result && result.affectedRows == 1)
							{
								return (res.render('connected/index'));
							}
							else
							{
								return (res.render('not_connected/index', {
									error: "Une erreur est survenu lors de votre inscription :(",
									i18n: res
								}));
							}
						});
					} else {
						res.render('inscription', {
								error: "votre mot de passe doit contenir au moins une minuscule, une majuscule, un nombre et avoir au moins une longeur de 8",
								i18n: res
						});
					}
				}
			});
		}
		else
			return (res.render('not_connected/index', {
						error: "Vos mots de passe ne correspondent pas",
						i18n: res
					}));
	}
	else
		return (res.render('not_connected/index', {
					error: "Veuillez remplir tous les champs !",
					i18n: res
				}));
});

module.exports = router;
