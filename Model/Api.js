const request	=	require('request');

module.exports = class Api
{

	get()
	{
		return new Promise((resolve, reject) => {
			request.get("http://127.0.0.1:3001/api", function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

	post(form)
	{
		return new Promise((resolve, reject) => {
			request.post({ url: "http://127.0.0.1:3001/api", form: form }, function (err, response, body) {
				if (err) throw console.log(err);;
				resolve(JSON.parse(body));
			});
		});
	}

}
