"use strict";

const express				=	require('express');
const router				=	express.Router();
const SQL					=	require('../Model/SQL.class.js');
const htmlspecialchars =	require("htmlspecialchars");

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  res.render('connected/video', {title: 'V for Vendetta'});
  // let sql = new SQL();
  //   sql.select('*', 'videos', {id: htmlspecialchars(id)}).then(result => {
  //     if (Object.keys(result).length > 0){
  //       res.render('connected/video', {video: result[0], title: result[0].title});
  //     }
  //     else {
  //       req.flashAdd('tabError', 'Cette video n\'existe pas.');
  //       res.redirect('/');
  //     }
  //   });
})

module.exports =  router;