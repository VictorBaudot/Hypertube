"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const htmlspecialchars = require("htmlspecialchars");
const Check = require('../Model/check');
const moment = require('moment');

router.post('/', (req, res, next) => {
  let user = req.user
  let com = {}
  let time = new Date();
  com.photo = user.photo
  com.com = req.body.newcom
  com.first_name = user.first_name
  com.creation = capitalizeFirstLetter(moment(time).fromNow())
  let obj = {
    video_id: req.body.video_id,
    user_id: user.id,
    com: com.com,
    creation: time
  }
  let sql = new SQL()
  Check.com(com.com, req, (check) => {
    if (check === true) {
      sql.insert('coms', obj).then((result) => {
        res.render('newcom', { com })
      });
    } else res.send('<div class="ui negative message">Format du commentaire incorrect</div>')
  });
})

module.exports = router;

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}