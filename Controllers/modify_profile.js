"use strict";

const express				=	require('express');
const router				=	express.Router();
const htmlspecialchars		=	require("htmlspecialchars");
const SQL					=	require('../Model/SQL.class.js');
const Check = require('../Model/check');
const bcrypt = require('bcrypt-nodejs');
const connection = require('../scripts/db');

router.post('/', (req, res, next) => {
  let params = req.body;
  res.redirect('back');
  // todo
})

module.exports = router