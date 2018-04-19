"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();
const htmlspecialchars = require("htmlspecialchars");
const moment = require('moment');

router.get('/:id', (req, res) => {
  let coms = [], genres = [], directors = [], actors = [];
  let user = req.user, video = {};
  let video_id = htmlspecialchars(req.params.id);
  let user_id = req.user.id

  sql.select('*', 'films', {}, { id: video_id }).then(result => {

  video = result[0];
  display(res);

    // if (Object.keys(result).length > 0) {
    //   video = result[0]
    //   user = req.user
    //   getInfos(res)
    // }
    // else {
    //   req.flashAdd('tabError', 'Cette video n\'existe pas.');
    //   res.redirect('/');
    // }
  });

  function display(res) {
    // console.log('Display')
    // console.log(video_id + " : " + user_id)
    // coms.forEach(com => {
    //   console.log(com.first_name + ': '+com.com)
    // })
    console.log(JSON.parse(JSON.stringify(video)));
    video = JSON.parse(JSON.stringify(video));
    console.log(user)
    res.render('connected/video', { video, title: video.title, user, coms, i18n: res });
  }

  function addVideoInfos(res) {
    let count2 = 0;
    let total2 = 3;
    let tabGenres = [], tabActors = [], director;
    video.id = htmlspecialchars(video.id)

    sql.select('*', 'actors', { table: 'videos_actors', column1: 'actors.actor', column2: 'videos_actors.actor' }, { video_id: video.id }).then(result => {
      if (Object.keys(result).length > 0) {
        result.forEach(row => {
          tabActors.push(row.actor)
        })
        video.actors = tabActors.join(', ')
      }
      if (++count2 == total2) display(res)
    });

    sql.select('*', 'genres', { table: 'videos_genres', column1: 'genres.genre', column2: 'videos_genres.genre' }, { video_id: video.id }).then(result => {
      if (Object.keys(result).length > 0) {
        result.forEach(row => {
          tabGenres.push(row.genre)
        })
        video.genres = tabGenres.join(', ')
      }
      if (++count2 == total2) display(res)
    });

    sql.select('*', 'directors', { table: 'videos_directors', column1: 'directors.director', column2: 'videos_directors.director' }, { video_id: video.id }).then(result => {
      if (Object.keys(result).length > 0) {
        video.director = result[0].director
      }
      if (++count2 == total2) display(res)
    });
  }

  function getInfos(res) {
    let count = 0;
    let total = 4;

    let data = ['genres', 'directors', 'actors']

    for (let i = 0; i < data.length; i++) {
      sql.select('*', data[i]).then(result => {
        if (Object.keys(result).length > 0) {
          data[i] = result
        }
        if (++count == total) addVideoInfos(res)
      });
    }

    sql.select('*', 'coms', { table: 'users', column1: 'coms.user_id', column2: 'users.id' }, { 'coms.video_id': video_id }, { col: 'coms.creation', order: 'DESC' }).then(result => {
      if (Object.keys(result).length > 0) {
        coms = result
        coms.forEach(com => {
          com.creation = capitalizeFirstLetter(moment(com.creation).fromNow())
        })
      }
      if (++count == total) addVideoInfos(res)
    });
  }
})

module.exports = router;


function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
