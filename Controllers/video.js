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
const FfmpegCommand = require('fluent-ffmpeg');

router.get('/:id', (req, res) => {
  let coms = [], genres = [], directors = [], actors = [];
  let user = req.user, video = {};
  let video_id = htmlspecialchars(req.params.id);
  let user_id = req.user.id

  sql.select('*', 'films', {}, { id: video_id }).then(result => {

    video = result[0];
    dlTorrent();
    sql.select('coms.com, coms.creation, users.photo, users.first_name', 'coms', {table: 'users', column1: 'coms.user_id', column2: 'users.id'}, {
      video_id: video_id
    }, {
      col: 'coms.creation',
      order: 'DESC'
    }).then(coms => {
      for (let i in coms)
        coms[i].creation = capitalizeFirstLetter(moment(coms[i].creation).fromNow())
      res.render('connected/video', { video, title: video.title, user, coms, i18n: res });
    });
  });

  function dlTorrent() {
	sql.select('*', 'downloads', {}, {imdb_id: video.imdb_id})
	.then(resp => {
		if (resp.length == 0) {
			return sql.insert('downloads', {
				imdb_id: video.imdb_id,
				started: 0,
        progress: 0,
        subtitles: 0,
        conversion: 0
			})
    } else {
      return Promise.resolve(resp[0])
    }
  })
  .then(videoStat => {
    if (videoStat.progress != 100) {
      let is_mkv = false;
      // torrent is new and we have to begin download it
      var engine = torrentStream(video.magnet)
      let total = 0;
      let progress = 0;
      engine.on('ready', function () {
        engine.files.forEach(function (file) {
          var stream = file.createReadStream();
          let write = fs.createWriteStream("/tmp/" + video.imdb_id + '.' + file.name.split('.').pop());
          if (file.name.split('.').pop() == "mkv")
            is_mkv = true;
          total += stream.length;

          stream.on('data', (chunk) => {
            progress += chunk.length;
            let progressPercent = Math.round(((progress / total) * 100))
            sql.update('downloads', 'imdb_id', video.imdb_id, {
              started: 1,
              progress: progressPercent
            })
          });
          stream.pipe(write);
        });
      });

      engine.on('idle', function() {
        if (is_mkv && !videoStat.conversion)
        {
          const converter = new FfmpegCommand()
          .input(fs.createReadStream(`/tmp/${video.imdb_id}.mkv`))
          .outputOption('-movflags frag_keyframe+empty_moov')
          .outputFormat('mp4')
          .output(fs.createWriteStream(`/tmp/${video.imdb_id}.mp4`))
          .on('error', (err, stdout, stderr) => { console.log('  miskine ', err, stdout, stderr)})
          .on('end', (chunk) => {
            sql.update('downloads', 'imdb_id', video.imdb_id, {
              conversion: 1
            })
          })
          converter.addOption('-vcodec')
          .addOption('copy')
          .addOption('-acodec')
          .addOption('copy')
          .run();
        }
        else
        {
          sql.update('downloads', 'imdb_id', video.imdb_id, {
            conversion: 1
          })
        }

        sql.update('downloads', 'imdb_id', video.imdb_id, {
          progress: 100
        })

        OpenSubtitles.search({
          imdbid: video.imdb_id,
          sublanguageid: 'fre,eng'
        })
        .then(subtitles => {
          for (let lang in subtitles) {
            let destSrt = `/tmp/${video.imdb_id}-${subtitles[lang].langcode}.srt`
            let subFile = fs.createWriteStream(destSrt)
            let request = http.get(subtitles[lang].url, response => {
              response
                .pipe(srt2vtt())
                .pipe(fs.createWriteStream(`/tmp/${video.imdb_id}-${subtitles[lang].langcode}.vtt`))
                .on('finish', () => {
                  sql.update('downloads', 'imdb_id', video.imdb_id, { subtitles: 1 })
                })
            })
          }
        })
      })
    }
  })
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
})

router.get('/download/:imdb_id', (req, res) => {
  sql.select('*', 'downloads', {}, {imdb_id: req.params.imdb_id})
  .then(dbResult => {
    if (!dbResult.length)
      res.send('error: cannot reach sql')
    res.send(dbResult[0])
  })
  .catch(err => {
    res.send('error: cannot reach sql')
  })
})

router.get('/view/:imdb_id', (req, res) => {
  let user = req.user
  let history = user.view_history && user.view_history.length ? user.view_history.split(',') : []
  if (history.findIndex(v => v == req.params.imdb_id) == -1) {
    history.push(req.params.imdb_id)
    sql.update('users', 'id', req.session.passport.user, {
      view_history: history.join(',')
    })
  }
  let date = new Date()
  let padding = (int) => {
    return ((int < 10) ? '0' + int : int);
  };
  sql.update('downloads', 'imdb_id', req.params.imdb_id, {
    _____last_view: date.getFullYear() + '-' + padding(date.getMonth()) + '-' + padding(date.getUTCDate())
  })
  res.send('ok')
})

module.exports = router;


function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
