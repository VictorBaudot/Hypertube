const request	=	require('request');

module.exports = class Imdb
{
	getById(id)
	{
		return new Promise((resolve, reject) => {
			request.post("http://imdbapi.net/api?key=yDDM2vEeZKyhBkypTsrgUUuOavQ4z8&id=" + id, function (err, response, body) {
				if (err) throw console.log(err);
				resolve(JSON.parse(body));
			});
		});
	}
}
