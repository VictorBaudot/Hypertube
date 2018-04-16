const request	=	require('request');

module.exports = class Api
{
	get()
	{
		return new Promise((resolve, reject) => {
			request.get("http://127.0.0.1:3001/api", function (err, response, body) {
				if (err) throw err;
				resolve(JSON.parse(body));
			});
		});
	}
}
