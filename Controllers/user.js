"use strict";

const express				=	require('express');
const router				=	express.Router();
const SQL					=	require('../Model/SQL.class.js');
const htmlspecialchars =	require("htmlspecialchars");

router.get('/:login', (req, res, next) => {
  let login = req.params.login;
  let sql = new SQL();
    sql.select('*', 'users', {login: htmlspecialchars(login)}).then(result => {
      if (Object.keys(result).length > 0){
        res.render('connected/user', {user: result[0], title:login});
      }
      else {
        req.flashAdd('tabError', 'Cet utilisateur n\'existe pas.');
        res.redirect('/');
      }
    });
})

module.exports =  router;