"use strict";

const express				=	require('express');
const router				=	express.Router();
const htmlspecialchars		=	require("htmlspecialchars");
const crypto 				=	require('crypto');
const SQL					=	require('../Model/SQL.class.js');

router.post('/', (req, res, next) => {
  let params = req.body;
  res.redirect('back');
  // todo
})

module.exports = router