"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const torrentStream = require('torrent-stream');
const fs = require('fs');

router.get('/:imdb_id', (req, res, next) => {

  const path = '/tmp/' + req.params.imdb_id + '.mp4';
  if (!fs.existsSync(path)) {
    res.send("cant get film try again later");
    return
  }
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
  
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
      
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }


});

router.get('/sub/:imdb_id/:lang', (req, res, next) => {

  const path = '/tmp/' + req.params.imdb_id + '-' + req.params.lang + '.vtt';
  if (fs.existsSync(path)) {
    const stat = fs.statSync(path);
    res.writeHead(200, {
      'Content-Type': 'text/vtt',
      'Content-Length': stat.size
    })
    fs.createReadStream(path).pipe(res)
  } else {
    res.send('subtitle not found')
  }
})

module.exports = router;
