// var torrentStream = require('torrent-stream');
// const fs = require('fs');
//
// var engine = torrentStream('magnet:?xt=urn:btih:2c7fac7a8b18716e7209fc4ad769642deab43ae1&dn=Game.of.Thrones.S05E08.HDTV.x264-KILLERS%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969');
//
// engine.on('ready', function() {
// 	engine.files.forEach(function(file) {
// 		console.log('filename:', file.name);
// 		var stream = file.createReadStream();
// 		let write = fs.createWriteStream("torrents/" + file.name);
// 		let total = stream.length;
// 		let progress = 0;
//
// 		stream.on('data', (chunk) => {
// 			progress += chunk.length;
// 			console.log("readed chunk : " + ((progress / total) * 100) + "%");
// 		});
// 		stream.pipe(write);
// 		// stream is readable stream to containing the file content
// 	});
// });

// const PirateBay = require('thepiratebay')
//
// PirateBay.search('killing', {
//   category: 'video'
// })
// .then(results => console.log(results))
// .catch(err => console.log(err))


let get_url = () => {
  return new Promise((resolve, reject) => {
    https.get("https://yts.am/api/v2/list_movies.json?limit=1", (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err.message);
    });
  });
}

get_url().then(result => {
  let res = JSON.parse(result);

  let uri = "magnet:?xt=urn:btih:" + res.data.movies[0].torrents[0].hash;

  var engine = torrentStream(uri);

  engine.on('ready', function() {
      engine.files.forEach(function(file) {
          console.log('filename:', file.name);
          var stream = file.createReadStream();
          let write = fs.createWriteStream("torrent/" + file.name);
          let total = stream.length;
          let progress = 0;

          stream.on('data', (chunk) => {
              progress += chunk.length;
              console.log("readed chunk : " + Math.round(((progress / total) * 100)) + "%");
          });
          stream.pipe(write);
      });
  });
});