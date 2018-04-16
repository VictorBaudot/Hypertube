const request	=	require('request');

module.exports = class Yify
{
	getOnePage(Pagenumber)
	{
		return new Promise((resolve, reject) => {
			request('https://yts.ag/api/v2/list_movies.json?sort_by=rating&limit=50&page=' + Pagenumber, function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body).data.movies);
			});
		});
	}

	getFilm(id)
	{
		return new Promise((resolve, reject) => {
			request('https://yts.am/api/v2/movie_details.json?movie_id=' + id, function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body));
			});
		});
	}

	getTorrent(id)
	{
		return new Promise((resolve, reject) => {
			request('https://yts.am/api/v2/movie_details.json?movie_id=' + id, function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body).data.movie.torrents[0].url);
			});
		});
	}

}
