"use strict";

const express = require('express');
const router = express.Router();
const SQL = require('../Model/SQL.class.js');
const sql = new SQL();
const htmlspecialchars = require("htmlspecialchars");
const moment = require('moment');
const torrentStream = require('torrent-stream');
const srt2vtt = require('srt-to-vtt');
const fs = require('fs');
const http = require('http');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
    useragent: 'TemporaryUserAgent',
    username: 'rbadia',
    password: '!^n^b%tmrfm57P2Io^s5'
});

router.get('/:id', (req, res) => {
  let coms = [], genres = [], directors = [], actors = [];
  let user = req.user, video = {};
  let video_id = htmlspecialchars(req.params.id);
  let user_id = req.user.id

  sql.select('*', 'films', {}, { id: video_id }).then(result => {

    video = result[0];
    dlTorrent()
    dlSubtitle()
    display(res);
  });

  function dlTorrent() {
	sql.select('*', 'downloads', {}, {imdb_id: video.imdb_id})
	.then(resp => {
		if (resp.length == 0) {
			return sql.insert('downloads', {
				imdb_id: video.imdb_id,
				started: 0,
        progress: 0,
        subtitles: 0
			})
    } else {
      return Promise.resolve(resp[0].progress)
    }
  })
  .then(insertResult => {
    if (insertResult != 100) {
      // torrent is new and we have to begin download it
      var engine = torrentStream(video.magnet)
      engine.on('ready', function () {
        engine.files.forEach(function (file) {
          var stream = file.createReadStream();
          let write = fs.createWriteStream("/goinfre/" + video.imdb_id + '.' + file.name.split('.').pop());
          let total = stream.length;
          let progress = 0;
  
          stream.on('data', (chunk) => {
            progress += chunk.length;
            let progressPercent = Math.round(((progress / total) * 100))
            sql.update('downloads', 'imdb_id', video.imdb_id, {
              started: 1,
              progress: progressPercent == 100 ? 99 : progressPercent
            })
            // console.log(`readed chunk for torrent ${video.title} (progress: ${progress}, total: ${total}: `, Math.round(((progress / total) * 100)) + "%");
          });
          stream.pipe(write);
        });
      });

      // kan c fini
      engine.on('idle', function() {
        sql.update('downloads', 'imdb_id', video.imdb_id, {
          progress: 100
        })

        OpenSubtitles.search({
          imdbid: 'tt1431045',
          sublanguageid: 'fre,eng'
        })
        .then(subtitles => {
          for (let lang in subtitles) {
            let destSrt = `/goinfre/${video.imdb_id}-${subtitles[lang].langcode}.srt`
            let subFile = fs.createWriteStream(destSrt)
            let request = http.get(subtitles[lang].url, response => {
              response.pipe(srt2vtt()).pipe(fs.createWriteStream(`/goinfre/${video.imdb_id}-${subtitles[lang].langcode}.vtt`))
            })
          }
        })
      })
    }
  })
  }

  function display(res) {
    console.log(JSON.parse(JSON.stringify(video)));
    video = JSON.parse(JSON.stringify(video));
    console.log(video.imdb_id)
	  console.log(user);
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

// ENDPOINT TO CHECK IF THE VIDEO IS READY TO BE PLAYED
router.get('/download/:imdb_id', (req, res) => {
  // console.log("req.params", req.params)
  sql.select('*', 'downloads', {}, {imdb_id: req.params.imdb_id})
  .then(dbResult => {
    // console.log('yay', dbResult)
    if (!dbResult.length)
      res.send('error: cannot reach sql')
    res.send(dbResult[0])
  })
  .catch(err => {
    res.send('error: cannot reach sql')
  })
})

module.exports = router;


function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
