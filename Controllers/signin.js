"use strict";

const express	=	require('express');
const router	=	express.Router();
const SQL =	require('../Model/SQL.class.js');
const htmlspecialchars =	require("htmlspecialchars");
const session	=	require("express-session");
const bodyParser =	require('body-parser');
const crypto 	=	require('crypto');

router.get('/', (req, res, next) => {
	res.render('not_connected/index', { error : false, i18n: res });
});

router.post('/', (req, res, next) => {
	let params = req.body;

	if (params.login && params.psswd)
	{
		let sql = new SQL();
		sql.select('id', 'users', {
			login: htmlspecialchars(params.login),
			psswd: crypto.createHash('md5').update(htmlspecialchars(params.psswd)).digest('hex')
		}).then(result => {
			if (Object.keys(result).length > 0)
			{
				req.session.id_user = result[0].id;
				return (res.redirect('/'));
			}
			else
				return (res.render('not_connected/index', {
					error: "Nous ne vous trouvons pas parmis nos inscrit :(",
					, i18n: res
				}));
		});
	}
	else
		return (res.render('not_connected/index', {
			error: "Veuillez remplir tous les champs !",
			, i18n: res
		}));
});

module.exports = router
