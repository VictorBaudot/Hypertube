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
/*(req, res, next) => {
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
						error: "Votre login est deja prit :("
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
									error: "Une erreur est survenu lors de votre inscription :("
								}));
							}
						});
					} else {
						res.render('inscription', {
								error: "votre mot de passe doit contenir au moins une minuscule, une majuscule, un nombre et avoir au moins une longeur de 8"
						});
					}
				}
			});
		}
		else
			return (res.render('not_connected/index', {
						error: "Vos mots de passe ne correspondent pas"
					}));
	}
	else
		return (res.render('not_connected/index', {
					error: "Veuillez remplir tous les champs !"
				}));
});*/
