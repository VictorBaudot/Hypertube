const request	=	require('request');

class Eztv
{
	getOnePage(Pagenumber)
	{
		return new Promise((resolve, reject) => {
			request("https://eztv.ag/api/get-torrents?limit=50&page=" + Pagenumber + "?sort=rating&order=1", function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body));
			});
		});
	}

	getSeason(id)
	{
		return new Promise((resolve, reject) => {
			request('https://eztv.ag/api/get-torrents?imdb_id=' + id, function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body).torrents);
			});
		});
	}

	getEpisode(idSeason, EpisodeNumber)
	{
		return new Promise((resolve, reject) => {
			request('https://eztv.ag/api/get-torrents?imdb_id=' + idSeason, function (err, response, body) {
				if (err) throw err;
				JSON.parse(body).torrents.forEach((elem) => {
					if (elem.episode == EpisodeNumber) {
						resolve(elem);
					}
				});
			});
		});
	}

	getMagnet(idSeason, EpisodeNumber)
	{
		return new Promise((resolve, reject) => {
			request('https://eztv.ag/api/get-torrents?imdb_id=' + idSeason, function (err, response, body) {
				if (err) throw err;
				JSON.parse(body).torrents.forEach((elem) => {
					if (elem.episode == EpisodeNumber) {
						resolve(elem.magnet_url);
					}
				});
			});
		});
	}

}
