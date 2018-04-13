"use strict";

const express	=	require('express');
const router	=	express.Router();

router.get('/', (req, res, next) => {
	res.render('not_connected/index', { error : false, i18n: res });
});

module.exports = router
