"use strict";

const express = require('express');
const router = express.Router();
const connection = require('../private/db');
const torrentStream = require('torrent-stream');
const fs = require('fs');

router.get('/', (req, res, next) => {

	const path = '/goinfre/Game.of.Thrones.S05E08.HDTV.x264-KILLERS.mp4';
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
	// const uri = 'magnet:?xt=urn:btih:2c7fac7a8b18716e7209fc4ad769642deab43ae1&dn=Game.of.Thrones.S05E08.HDTV.x264-KILLERS%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969';
	// var engine = torrentStream(uri);

	// engine.on('ready', function() {
	//     engine.files.forEach(function(file) {
	//         console.log('filename:', file.name);
	//         var stream = file.createReadStream();
	//         let write = fs.createWriteStream("/goinfre/" + file.name);
	//         let total = stream.length;
	//         let progress = 0;

	//         stream.on('data', (chunk) => {
	//             progress += chunk.length;
	//             console.log("readed chunk : " + Math.round(((progress / total) * 100)) + "%");
	//         });
	//         stream.pipe(write);
	//     });
  // });
  
  console.log(range)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
      
        const chunksize = (end-start)+1
        console.log(`start: ${start}, end: ${end}, fileSize: ${fileSize}, chunksize: ${chunksize}`)
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
      console.log('no range idk why')
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }


});

module.exports = router;
