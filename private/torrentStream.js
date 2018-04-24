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
          var stream = file.createReadStream();
          let write = fs.createWriteStream("torrent/" + file.name);
          let total = stream.length;
          let progress = 0;

          stream.on('data', (chunk) => {
              progress += chunk.length;
          });
          stream.pipe(write);
      });
  });
});
