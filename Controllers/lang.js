const express				=	require('express');
const session      			=	require('express-session');
const router				=	express.Router();

router.post('/', function (req, res) {
	if (req.session.login == undefined) {
		req.flash("error", "Vous devez vous connecter");
		return (res.redirect('/signin'));
	}

	res.cookie('i18n', session.lang);
	res.redirect('/');
});

module.exports = router
