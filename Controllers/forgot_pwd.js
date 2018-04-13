"use strict";

const express	=	require('express');
const router	=	express.Router();
const SQL =	require('../Model/SQL.class.js');
const htmlspecialchars =	require("htmlspecialchars");
const session	=	require("express-session");
const bodyParser =	require('body-parser');

router.get('/', (req, res, next) => {
	res.render('not_connected/forgot_pwd', { error : false });
});

router.post('/', (req, res, next) => {
  let params = req.body;
  // todo
});

module.exports = router