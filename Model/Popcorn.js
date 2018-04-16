const request	=	require('request');

module.exports = class Popcorn
{
	getOnePage(Pagenumber)
	{
		return new Promise((resolve, reject) => {
			request("https://tv-v2.api-fetch.website/movies/" + Pagenumber + "?sort=rating&order=1", function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body));
			});
		});
	}

	getFilm(id)
	{
		return new Promise((resolve, reject) => {
			request('https://tv-v2.api-fetch.website/movie/' + id, function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body));
			});
		});
	}

	getMagnet(id)
	{
		return new Promise((resolve, reject) => {
			request('https://tv-v2.api-fetch.website/movie/' + id, function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body).torrents.en['720p'].url);
			});
		});
	}

}
