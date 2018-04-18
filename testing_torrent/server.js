const express = require('express');
const app = express();
const torrentStream = require('torrent-stream');
const http = require('https');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

var options = {
	"method": "GET",
	"hostname": "tv-v2.api-fetch.website",
	"port": null,
	"path": "/random/movie",
	"headers": {}
};

var rootPath = process.cwd();

app.set('views', path.join(__dirname + '/view'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/view'));

app.get('/', (req, res) => {
	res.render('view');
});

let server = require('http').createServer(app);
let io = require('socket.io')(server);

// io.sockets.on('connection', (socket) => {
// 	console.log("new user go search video !");
//
// });

let getVideo = (engine) => {
	return new Promise((resolve, reject) => {
		engine.on('ready', () => {
			engine.files.forEach((file) => {
				resolve(file);
			});
		});
	});
};

var req = http.request(options, (res) => {
	var chunks = [];

	res.on("data", (chunk) => {
		chunks.push(chunk);
	});

	res.on("end", async () => {
		var buffer = Buffer.concat(chunks);
		var data = JSON.parse(buffer.toString());
		var uri = data.torrents.en['720p'].url;
		var engine = torrentStream(uri, {
			connections: 100,
	    uploads: 10,
	    tmp: 'torrent/tmp',
	    path: 'torrent/downloads',
	    verify: true,
	    dht: true,
	    tracker: true,
		});

		let video = await getVideo(engine);
		let stream = video.createReadStream();
		let write = fs.createWriteStream(stream);
		let total = stream.length;
		let progress = 0;

		stream.on('data', (chunk) => {
			progress += chunk.length;
			console.log("readed chunk : " + ((progress / total) * 100) + "%");
		});

		stream.pipe(write);

		write.on('finish', () => {
			console.log("file has been saved");
		});
	});
});

req.write("{}");
req.end();

server.listen(3030);
