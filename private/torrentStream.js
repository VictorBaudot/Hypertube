var torrentStream = require('torrent-stream');
const fs = require('fs');

var engine = torrentStream('magnet:?xt=urn:btih:2c7fac7a8b18716e7209fc4ad769642deab43ae1&dn=Game.of.Thrones.S05E08.HDTV.x264-KILLERS%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969');

engine.on('ready', function() {
	engine.files.forEach(function(file) {
		console.log('filename:', file.name);
		var stream = file.createReadStream();
		let write = fs.createWriteStream("torrents/" + file.name);
		let total = stream.length;
		let progress = 0;

		stream.on('data', (chunk) => {
			progress += chunk.length;
			console.log("readed chunk : " + ((progress / total) * 100) + "%");
		});
		stream.pipe(write);
		// stream is readable stream to containing the file content
	});
});

// const PirateBay = require('thepiratebay')
//
// PirateBay.search('Game of Thrones', {
//   category: 205
// })
// .then(results => console.log(results))
// .catch(err => console.log(err))
