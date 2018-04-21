"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL()
const htmlspecialchars = require("htmlspecialchars");
const Check = require('../Model/check');
const moment = require('moment');

router.post('/', (req, res, next) => {
  let user = req.user
  let com = {}
  let time = new Date();
  com.photo = user.photo
  com.com = htmlspecialchars(req.body.newcom)
  com.first_name = user.first_name
  com.creation = capitalizeFirstLetter(moment(time).fromNow())
  let obj = {
    video_id: req.body.video_id,
    user_id: user.id,
    com: com.com,
    creation: time
  }
  sql.insert('coms', obj).then((result) => {
    res.render('newcom', { com })
  });
})

module.exports = router;

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
