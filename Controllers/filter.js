"use strict";

const express	=	require('express');
const router	=	express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();
const htmlspecialchars = require("htmlspecialchars");

router.post('/', (req, res, next) => {
  let id = req.user.id;
  let genres = [], directors = [], actors = [], videos = [];
  let {scoreL, scoreU, yearL, yearU, videos_viewed, state, filterGenres, filterDirectors, filterActors, sortType, sortOrder} = req.body
  let filters = {
    score: {l: 3.0, u: 5.0},
    year: {l: 1900, u: 2018},
    genres: [],
    directors: [],
    actors: [],
    sortType: "score",
    sortOrder: "desc",
    videos_viewed: "all"
  }
  let request = "SELECT * FROM videos WHERE id > 0"

  if (scoreL && scoreU && scoreL >= 0 && scoreL <= 4.9 && scoreU >= 0.1 && scoreU <= 5) {
    request += " AND score >= " + scoreL + " AND score <= " + scoreU
    filters.score.l = scoreL
    filters.score.u = scoreU
  }
  if (yearL && yearU && yearL >= 1800 && yearL <= 2017 && yearU >= 1801 && yearU <= 2018) {
    request += " AND year >= " + yearL + " AND year <= " + yearU
    filters.year.l = yearL
    filters.year.u = yearU
  }

  if (sortType && (sortType === "name" || sortType === "score" || sortType === "year")) {
    filters.sortType = sortType
    if (sortType === "name") request += " ORDER BY title"
    else request += " ORDER BY " + sortType
    if (sortOrder && (sortOrder === "asc" || sortOrder === "desc")) {
      filters.sortOrder = sortOrder
      request += " " + sortOrder.toUpperCase()
    }
  }
  console.log(request)

  function display() {
    console.log('Display')
    // console.log(req.body)
    // console.log("New filters")
    // console.log(filters)
    // console.log(videos)
    // videos.forEach(video => {
    // 	console.log(video.genres)
    // })
    if (filterGenres) {
      filters.genres = filterGenres.split(',')
      let ok = true
      let tab = []
      for (let i = 0; i < videos.length; i++) {
        ok = true
        tab = videos[i].genres.split(', ')
        filters.genres.forEach( filter => {
          if (!tab.includes('#'+filter)) ok = false
        })
        if (ok == false) videos.splice(i--, 1)
      }
    }
    if (filterDirectors) {
      filters.directors = filterDirectors.split(',')
      let ok = true
      let tab = []
      for (let i = 0; i < videos.length; i++) {
        ok = true
        tab = videos[i].director.split(', ')
        filters.directors.forEach( filter => {
          if (!tab.includes(filter)) ok = false
        })
        if (ok == false) videos.splice(i--, 1)
      }
    }
    if (filterActors) {
      filters.actors = filterActors.split(',')
      let ok = true
      let tab = []
      for (let i = 0; i < videos.length; i++) {
        ok = true
        tab = videos[i].actors.split(', ')
        filters.actors.forEach( filter => {
          if (!tab.includes(filter)) ok = false
        })
        if (ok == false) videos.splice(i--, 1)
      }
    }
    if (videos_viewed && videos_viewed !== "all") {
      filters.videos_viewed = videos_viewed
      for (let i = 0; i < videos.length; i++) {
        if (videos[i].seen !== videos_viewed)
          videos.splice(i--, 1)
      }
    }
    res.render("connected/index", { title: 'Accueil', videos, filters, genres, directors, actors, i18n: res })
  }

  function addVideosInfos() {
    console.log('Add Videos Infos')
    let count = 0;
    let total = videos.length;
    videos.forEach(video => {
      // console.log(video)
      let count2 = 0;
      let total2 = 4;
      let tabGenres = [], tabActors = [];

      let check = () => {
        if (++count == total) display()
      }

      video.id = htmlspecialchars(video.id)

      sql.select('*', 'actors', { table: 'videos_actors', column1: 'actors.actor', column2: 'videos_actors.actor' }, { video_id: video.id }).then(result => {
        if (Object.keys(result).length > 0) {
          result.forEach(row => {
            tabActors.push(row.actor)
          })
          video.actors = tabActors.join(', ')
          if (++count2 == total2) check()
        }
      });

      sql.select('*', 'genres', { table: 'videos_genres', column1: 'genres.genre', column2: 'videos_genres.genre' }, { video_id: video.id }).then(result => {
        if (Object.keys(result).length > 0) {
          result.forEach(row => {
            tabGenres.push('#' + row.genre)
          })
          video.genres = tabGenres.join(', ')
          if (++count2 == total2) check()
        }
      });

      sql.select('*', 'directors', { table: 'videos_directors', column1: 'directors.director', column2: 'videos_directors.director' }, { video_id: video.id }).then(result => {
        if (Object.keys(result).length > 0) {
          video.director = result[0].director
          if (++count2 == total2) check()
        }
      });
      
      sql.select('*', 'videos_users', {}, { video_id: video.id, user_id: id }).then(result => {
        if (result[0]) video.seen = result[0].seen
        else video.seen = 'N'
        if (++count2 == total2) check()
      });
      
    });
    
  }

  function getVideos() {
    console.log('Get Videos')
    sql.sql.query(request, (err, rows) => {
      if (err) throw err;
      videos = rows
      addVideosInfos()
    });
  }

  function getInfos() {
    console.log('Get Infos')
    let count = 0;
    let total = 3;
    let data = ['genres', 'directors', 'actors']

    for (let i = 0; i < data.length; i++) {
      sql.select('*', data[i]).then(result => {
        if (Object.keys(result).length > 0) {
          data[i] = result
          if (++count == total) getVideos()
        }
      });
    }
  }

  getInfos()
});

module.exports = router